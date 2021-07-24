var ATTRIBUTE_LABELS=["label","aria-label","data-label","data-fieldlabel","data-displaylabel"],PT_MULTISPACE=/\s+/g,PT_SKIP_CHARS=/[^A-Za-z0-9\s\-\.\?\(\)\[\]\{\},;]+/g,CSS_FORMS="form",CSS_DIRECT_LABELS="label[for],input[aria-labelledby],select[aria-labelledby],button[aria-labelledby],textarea[aria-labelledby],*[aria-labelledby][role=checkbox],*[aria-labelledby][role=radio],*[aria-labelledby][role=listbox],*[aria-labelledby][role=textbox],*[aria-labelledby][role=button]",CSS_DIRECT_INPUT_ELEMENTS=
"input,select,button,textarea",CSS_ROLE_BASED_INPUT_ELEMENTS="*[role=checkbox],*[role=radio],*[role=listbox],*[role=textbox],*[role=button]",SIBLING_LABEL_ELEMENTS="*[class*=label],*[class*=Label],*[class*=LABEL],*[class*=lbl],*[class*=Lbl],*[class*=LBL],*[name*=label],*[name*=Label],*[name*=LABEL],*[name*=lbl],*[name*=Lbl],*[name*=LBL]",ElementType=Object.freeze({TEXT:1,RADIO:2,CHECKBOX:3,SELECT:4,BUTTON:5,IMAGE:6,EMAIL:7,FILE:8,PHONE:9,ANCHOR:10,HIDDEN:11,OTHER:99}),LabelPreference=Object.freeze({LEFT:1,
RIGHT:2,CENTER:3,NONE:99});function WebPage(a){if(!a instanceof HTMLDocument)throw Error('InvalidArgumentError: WebPage constructor - param "document" should be of type HTMLDocument');this.document=a;this.directLabelMap=getDirectLabelMap.call(this)}
WebPage.prototype.getLabel=function(a){if(!a instanceof HTMLElement)throw Error('InvalidArgumentError: WebPage getLabel - param "element" should be of type HTMLElement');var b=getElementType(a),c=getLabelPreference(b);if(b===ElementType.HIDDEN||isElementHidden(a))return null;if(this.directLabelMap.has(a))return this.directLabelMap.get(a);for(var e=a;(e=e.parentElement)&&"form"!==e.tagName.toLowerCase(););switch(b){case ElementType.ANCHOR:var d=getAnchorLabel;break;case ElementType.BUTTON:d=getButtonLabel;
break;case ElementType.RADIO:case ElementType.CHECKBOX:d=getRadioLabel;break;default:d=null}d=null===d?null:d(a);if(null!==d)return d;if(null!==e&&isFormElement(b)){d=a;for(var f,g;(d=d.parentElement)&&d!==e;)if((d.getAttribute("class")||"").indexOf("form-group")){d=d.getElementsByTagName("label");0<d.length&&(g=d[0],f=textContent(g));break}if(isValidLabel(f))return{text:f,element:g}}if(c===LabelPreference.NONE&&(f=getFirstAncestorByTagName(a,["a","button"]),null!==f))return d="a"===f.tagName.toLowerCase()?
getAnchorLabel:getButtonLabel,d(f);if(b===ElementType.IMAGE&&(d=getImageLabel(a),null!==d))return d;d=getAttributeLabel(a);if(null!==d)return d;e=null!==e&&isFormElement(b)?e:null;e=getElementWrapper(a,e,c);if(c===LabelPreference.NONE&&(f=textContent(a),isValidLabel(f)))return{text:f,element:null};d=null;c===LabelPreference.scrollLeft||c===LabelPreference.NONE?d=getHeadText:c===LabelPreference.LEFT&&(d=getTailText);d=null===d?null:d(e);if(null!==d)return d;d=getLabelFromSiblings(e,c);if(null!==d)return d;
switch(b){case ElementType.EMAIL:case ElementType.FILE:case ElementType.PHONE:d=getFallbackInputLabel;break;case ElementType.TEXT:d=getFallbackTextLabel;break;case ElementType.SELECT:d=getFallbackSelectLabel;break;default:d=getFallbackAttributeLabel}return d=d(a,b)};
function getElementType(a){var b=a.tagName.toLowerCase(),c=(a.getAttribute("type")||"").toLowerCase();a=(a.getAttribute("role")||"").toLowerCase();switch(b){case "input":switch(c){case "button":case "submit":case "reset":b=ElementType.BUTTON;break;case "radio":case "checkbox":b=ElementType.CHECKBOX;break;case "image":b=ElementType.IMAGE;break;case "email":b=ElementType.EMAIL;break;case "file":b=ElementType.FILE;break;case "tel":b=ElementType.PHONE;break;case "hidden":b=ElementType.HIDDEN;break;default:b=
ElementType.TEXT}break;case "a":b=ElementType.ANCHOR;break;case "img":b=ElementType.IMAGE;break;case "select":b=ElementType.SELECT;break;case "radio":b=ElementType.RADIO;break;case "button":b=ElementType.BUTTON;break;case "textarea":b=ElementType.TEXT;break;default:switch(a){case "textbox":b=ElementType.TEXT;break;case "radio":b=ElementType.RADIO;break;case "checkbox":b=ElementType.CHECKBOX;break;case "listbox":b=ElementType.SELECT;break;case "button":b=ElementType.BUTTON;break;default:b=ElementType.OTHER}}return b}
function getElementWrapper(a,b,c){var e="select"===a.tagName.toLowerCase()?"":textContent(a);if(c===LabelPreference.NONE&&""!==e)return a;if(c===LabelPreference.RIGHT||c===LabelPreference.LEFT){e=getSiblings(a,c);for(var d=0;d<e.length;d++){var f=e[d];if("select"!==f.tagName.toLowerCase()){_sibling=cloneAndClean(f);if(isValidLabel(textContent(_sibling)))return a;var g;c===LabelPreference.LEFT?g=getHeadText(f):c===LabelPreference.RIGHT&&(g=getTailText(f));if(null!==g)return a}}}g=a;do{if(c==LabelPreference.LEFT&&
!isFirstSibling(g)||c==LabelPreference.RIGHT&&!isLastSibling(g))return g;g=g.parentElement}while(null!==g&&g!==b);return a}function isFirstSibling(a){a=getSiblings(a,!0);if(0===a.length)return!0;for(var b=0;b<a.length;b++){var c=a[b];if("select"!==c.tagName.toLowerCase()&&isValidLabel(textContent(c)))return!1}return!0}
function isLastSibling(a){a=getSiblings(a,!1);if(0===a.length)return!0;for(var b=0;b<a.length;b++){var c=a[b];if("select"!==c.tagName.toLowerCase()&&isValidLabel(textContent(c)))return!1}return!0}function isFormElement(a){return a===ElementType.TEXT||a===ElementType.PHONE||a===ElementType.EMAIL||a===ElementType.FILE||a===ElementType.RADIO||a===ElementType.CHECKBOX||a===ElementType.SELECT}
function getLabelPreference(a){return a===ElementType.RADIO||a===ElementType.CHECKBOX?LabelPreference.RIGHT:a===ElementType.TEXT||a===ElementType.PHONE||a===ElementType.EMAIL||a===ElementType.FILE||a===ElementType.SELECT?LabelPreference.LEFT:LabelPreference.NONE}function isTemporaryLabel(a){if(null===a)return!0;a=a.trim();return""===a||/(?:required|mandatory|missing|error)/i.test(a)}
function isValidLabel(a){a&&(a=a.replace(PT_SKIP_CHARS,""),a=a.replace(PT_MULTISPACE," "),a=a.trim());return null!==a&&"undefined"!==typeof a&&""!==a}function isElementHidden(a){return null===a.offsetParent}
function cloneAndClean(a,b){var c=a.cloneNode(!0);c.querySelectorAll("select").forEach(function(d){d!==c&&d!==b&&d.remove()});var e=[];a.querySelectorAll("*").forEach(function(d){d!==c&&isElementHidden(d)&&e.push(d.outerHtml)});c.querySelectorAll("*").forEach(function(d){0<e.length&&d.outerHtml===e[0]&&(d.remove(),e.shift())});return c}
function getFirstAncestorByTagName(a,b){if(null===b||0===b.length)return null;for(var c=a.parentElement;null!==c;){if(0<=b.indexOf(c.tagName.toLowerCase()))return c;c=c.parentElement}return null}function getSiblings(a,b){for(var c=[];a=b?a.previousElementSibling:a.nextElementSibling;)a.nodeType===Node.ELEMENT_NODE&&c.push(a);return c}function textContent(a){return!a||!a instanceof Node?"":a.textContent.replace(PT_MULTISPACE," ").trim()}
function getHeadText(a){return(a=a&&a.previousSibling&&a.previousSibling.nodeType===Node.TEXT_NODE&&a.previousSibling.nodeValue&&a.previousSibling.nodeValue.trim())?{text:a,element:null}:null}function getTailText(a){return(a=a&&a.nextSibling&&a.nextSibling.nodeType===Node.TEXT_NODE&&a.nextSibling.nodeValue&&a.nextSibling.nodeValue.trim())?{text:a,element:null}:null}
function getToolTipLabel(a){for(var b=["alt","title"],c=0;c<b.length;c++)if(label=a.getAttribute(b[c]),null!==label)return{text:label.trim(),element:null};return null}function getAnchorLabel(a){var b=textContent(a);if(isValidLabel(b))return{text:b,element:null};b=a.querySelector("img");return null!==b&&(b=getImageLabel(b),null!==b)?b:getToolTipLabel(a)}
function getButtonLabel(a){var b=textContent(a)||a.getAttribute("value");if(isValidLabel(b))return{text:b,element:null};b=a.querySelector("img");if(null!==b&&(b=getImageLabel(b),null!==b))return b;for(b=0;b<a.children.length;b++)for(var c=a.children[b],e=0;e<c.classList.length;e++){var d=c.classList[e];if(/(?:glyphicon|icon)\-/i.test(d)&&(d=d.replace(/(?:glyphicon|icon)\-/ig,"").trim()))return{text:d,element:null}}b="";try{b=a.getAttribute("type").toLowerCase()}catch(f){b=(b=a.getAttribute("onclick"))?
b.split("(")[0].toLowerCase():b}return"submit"===b?{text:"Submit",element:null}:"reset"===b?{text:"Reset",element:null}:{text:b,element:null}}function getRadioLabel(a){var b=getTailText(a);if(null!==b)return b;b=getLabelFromSiblings(a,LabelPreference.RIGHT);return null!==b?b:getToolTipLabel(a)}function getImageLabel(a){return getToolTipLabel(a)}
function getAttributeLabel(a){for(var b=0;b<ATTRIBUTE_LABELS.length;b++){var c=a.getAttribute(ATTRIBUTE_LABELS[b]);if(null!==c)return{text:c,element:null}}return null}function getFallbackTextLabel(a){for(var b=["placeholder","alt","title"],c,e=0;e<b.length;e++)if(c=a.getAttribute(b[e]),null!==c)return{text:c.trim(),element:null};if("search"===(a.getAttribute("type")||"").toLowerCase())return{text:"Search",element:null}}
function getFallbackInputLabel(a,b){var c=getFallbackTextLabel(a);if(null!==c)return c;switch(b){case LabelPreference.EMAIL:c="eMail";break;case LabelPreference.FILE:c="File";break;case LabelPreference.PHONE:c="Phone";break;default:c=null}return null===c?c:{text:c,element:null}}
function getFallbackSelectLabel(a){var b=getToolTipLabel(a);if(null!==b)return b;b=a.tagName.toLowerCase();var c=(a.getAttribute("role")||"").toLowerCase(),e;"select"===b?e=a.querySelector("option[selected]")||a.querySelector("option"):"listbox"===c&&(e=a.querySelector("*[role=option][class~=selected]")||a.querySelector("*[role=option]"));return null!==e&&(a=textContent(e),isValidLabel(a)&&!/none/.test(a.toLowerCase()))?{text:a.replace(/\-/g,"").trim(),element:null}:null}
function getFallbackAttributeLabel(a){for(var b=["name","data-name"],c=0;c<b.length;c++){var e=a.getAttribute(b[c]);if(null!==e)return{text:e.trim(),element:null}}return null}
function getLabelFromSiblings(a,b){if(b===LabelPreference.LEFT)var c=getSiblings(a,!0);else b===LabelPreference.RIGHT?c=getSiblings(a,!1):b===LabelPreference.NONE&&(c=getSiblings(a,!0),c=c.concat(getSiblings(a,!1)));for(var e=0;e<c.length;e++){var d=c[e];if("label"===d.tagName.toLowerCase()&&!d.getAttribute("for")){var f=textContent(d);if(isValidLabel(f))return{text:f,element:d}}d=d.querySelector(SIBLING_LABEL_ELEMENTS);if(null!==d&&(f=textContent(cloneAndClean(d)),isValidLabel(f)))return{text:f,
element:d}}for(e=0;e<c.length;e++){d=c[e];f=b===LabelPreference.LEFT?getHeadText:b===LabelPreference.RIGHT?getTailText:null;xLabel=null!==f&&f(d);if(null!==xLabel)return xLabel;f=textContent(cloneAndClean(d));if(isValidLabel(f))return{text:f,element:d}}return null}
function getDirectLabelMap(){var a=new Map,b=this;this.document.querySelectorAll(CSS_DIRECT_LABELS).forEach(function(c){var e=c.getAttribute("for");if(null!==e){var d=b.document.getElementById(e);var f=textContent(c);null!==d&&isValidLabel(f)&&(e=getElementType(d),e===ElementType.RADIO||e===ElementType.CHECKBOX)&&(f=getRadioLabel(d),f=null===f?null:f.text)}e=c.getAttribute("aria-labelledby");if(null!==e){d=c;c=b.document.getElementById(e);f=e.split(" ");for(e=f.length-1;null===c&&0<=e;)c=b.document.getElementById(f[e--]);
f=textContent(c)}if(d&&f){f={text:f,element:c};if(a.has(d)){c=a[d];if(isTemporaryLabel(f.text)||isElementHidden(f.element))return;if(c&&c.text&&(isTemporaryLabel(c.text)||!isElementHidden(c.element))){a.set(d,f);return}}a.set(d,f)}});return a};