import {AcuElementType} from "./elements/acu-element";
import {QPField, QPFieldElementType} from "./elements/qp-field";
import AcuPageParser from "./acu-page-parser";
import {AcuContainer} from "./elements/acu-container";
import {QPFieldset} from "./elements/qp-fieldset";

describe('AcuPageParser', () => {
    let sut: AcuPageParser;

    beforeEach(() => {
        sut = new AcuPageParser();
    });


    test('qp-field', async () => {
        const elementHtml = `
<div>
  <qp-field control-id="edDocument-OrderNbr" control-type.bind="df.controlType" no-label.bind="df.noLabel == null ? noLabel : df.noLabel" caption.bind="df.caption" control-state.bind="state" context.bind="$this" collapsed.bind="collapsed" pinned.one-way="getFieldPinned(df)" tab-index.one-way="getFieldTabIndex(df)" name="OrderNbr" class="au-target qp-field qp-field-expanded" au-target-id="1772">
      
      <!--anchor-->
  
      <div show.bind="controlState.visible === undefined || controlState.visible !== false" data-tooltip.bind="errorMessage" data-error-level.bind="errorLevel" data-id.bind="dataId" class="au-target wrapper" au-target-id="230" data-error-level="0" data-id="edDocument-OrderNbr">
  
          <span class="label-wrapper no-label au-target" show.bind="!noLabel" au-target-id="231">
              
                  <!--view-->
      
  
      <div class="label-container">
          <label for.bind="controlId" click.delegate="processClick()" ref="element" class="au-target clickable" au-target-id="601" for="edDocument-OrderNbr">Subcontract Nbr.</label>
          <qp-tooltip get-visible.call="showTooltip()" class="au-target" au-target-id="603">
      
      <div ref="contentElement" glue-to="target.bind: glueTarget; options.bind: {ignoreTargetWidth:true, centerToTarget: centerToTarget, verticalDistanceFromTargetPX:8}" style="display: none" glued.delegate="afterGlued($event)" click.capture="stopPropagation($event)" class="au-target qp-tooltip-container" au-target-id="332">
          Subcontract Nbr.<!--slot-->
      </div>
  </qp-tooltip><!--anchor-->
      </div>
  <!--anchor--><!--anchor-->
              <!--slot-->
          </span>
  
          <div class="control-container no-label size-default">
              <div class="au-target main-field qp-selector-control" au-target-id="235">
                  <div class="icon-container"></div><!--anchor-->
                  <enhanced-compose view-model.bind="controlType || defaultControlType" config.bind="controlConfig" state.bind="controlState" value.two-way="controlState.value" control-id.bind="effectiveId" context.bind="context" proxy-expressions.bind="proxyExpressions" class="main-control au-target" au-target-id="237">
      
      
      <div ref="editorDiv" tabindex="-1" class="au-target editor qp-selector" au-target-id="1036" id="edDocument-OrderNbr">
          <!--anchor-->
          <enhanced-compose show.bind="!isDisplayMode" class="qp-editor-plugin au-target" view-model.bind="editorType" config.bind="editorConfig" value.two-way="editorValue" elem-text.from-view="editor" converter.to-view="converterType" keydown.delegate="handleKeyDown($event)" au-target-id="1044">
  
  
  <!--anchor-->
  
  
      <!--anchor-->
      
      <!--anchor-->
  
      <input ref="elemText" autocomplete="off" autocorrect="off" maxlength.bind="config.maxLength &amp; attr" enabled.bind="config.enabled ? null : false &amp; attr" spellcheck.bind="config.spellcheck ? null : false &amp; attr" placeholder.bind="config.placeholder &amp; attr" value.bind="value | meta : converter : hasFocus : editorState : config &amp; updateTrigger : 'blur' : 'update'" keydown.trigger="processKeyDown($event)" input.delegate="processInput($event)" focus.trigger="processFocus($event)" blur.trigger="processBlur($event)" paste.delegate="processPaste($event)" class="au-target qp-text-editor" au-target-id="220" type="text" id="edDocument-OrderNbr_text" name="" tabindex="0"><!--anchor-->
      <!--anchor-->
      <qp-panel id="pnlLocaleEditor" class="au-target" au-target-id="225" template="true" style="display: none;">
          <div class="qp-field-wrapper" repeat.for="translation of translations">
                  <span class="label-wrapper label-size-sm">
                      <qp-label-light caption="bla" control-id="translation_bla"></qp-label-light>
                  </span>
              <div class="control-container size-xxl">
                  <qp-text-editor config.bind="{class: 'editor', id: bla" value.two-way="translation.valueString">
                  </qp-text-editor>
              </div>
          </div>
      </qp-panel>
          <!--anchor-->
      <!--anchor-->
  </enhanced-compose>
          <!--anchor-->
  
          <button type="button" mousedown.capture="openSelector($event)" class="qp-field-editor__button au-target" tabindex="-1" au-target-id="1053">
              <qp-icon imagesrc="svg:main@search" class="buttonsCont au-target" type="sel" au-target-id="1054">
      
      <!--anchor-->
      <!--anchor-->
      <svg>
          <use href.bind="imageName &amp; attr" class="au-target" au-target-id="405" href="/src/Content/svg_icons/main.svg?c6faad4369844a607b25#search"></use>
      </svg><!--anchor-->
      <!--anchor-->
  </qp-icon>
  
              <!-- <div class="buttonsCont sprite-icon control-icon" icon="SelectorN" type="sel">
                  <div class="control-icon-img control-SelectorN">
                  </div>
              </div> -->
          </button><!--anchor-->
      </div>
  
      <qp-suggester config.bind="suggester" editor.bind="editor" rect-element.bind="editorDiv" force-open.two-way="suggesterOpen" suggest-on-blur.bind="suggestOnBlur" set-editor-value.call="setSuggestedValue(value, display, useUpdateValue)" class="au-target" au-target-id="1056">
    
    <!--anchor-->
  </qp-suggester><!--anchor-->
      <!--anchor-->
  </enhanced-compose><!--anchor-->
              </div>
              <!--slot-->
  
          </div>
      </div>
  </qp-field>
</div>`

        const actual = await sut.parse(elementHtml);

        const qpField: QPField = {
            Label: 'Subcontract Nbr.',
            Type: AcuElementType.QPField,
            Value: null,
            ElementType: QPFieldElementType.TextEditor,
        }
        const expected: AcuContainer = {
            Type: AcuElementType.Root,
            Children: [qpField],
        }
        expect(actual).toEqual(expected)
    })

    test('qp-fieldset', async () => {
        const elementHtml = `<div><qp-fieldset slot="A" id="form01" view.bind="Document" class="au-target qp-fieldset fieldset-titleless" au-target-id="1570"> <fieldset class="au-target" au-target-id="1418" id="form01"> <!--anchor--> <!--view--><qp-field control-id="edDocument-OrderNbr" control-type.bind="df.controlType" no-label.bind="df.noLabel == null ? noLabel : df.noLabel" caption.bind="df.caption" control-state.bind="state" context.bind="$this" collapsed.bind="collapsed" pinned.one-way="getFieldPinned(df)" tab-index.one-way="getFieldTabIndex(df)" name="OrderNbr" class="au-target qp-field qp-field-expanded" au-target-id="1772"> <!--anchor--> <div show.bind="controlState.visible === undefined || controlState.visible !== false" data-tooltip.bind="errorMessage" data-error-level.bind="errorLevel" data-id.bind="dataId" class="au-target wrapper" au-target-id="230" data-error-level="0" data-id="edDocument-OrderNbr"> <span class="label-wrapper no-label au-target" show.bind="!noLabel" au-target-id="231"> <!--view--> <div class="label-container"> <label for.bind="controlId" click.delegate="processClick()" ref="element" class="au-target clickable" au-target-id="601" for="edDocument-OrderNbr"> Subcontract Nbr. </label> <qp-tooltip get-visible.call="showTooltip()" class="au-target" au-target-id="603"> <div ref="contentElement" glue-to="target.bind: glueTarget; options.bind: {ignoreTargetWidth:true, centerToTarget: centerToTarget, verticalDistanceFromTargetPX:8}" style="display: none" glued.delegate="afterGlued($event)" click.capture="stopPropagation($event)" class="au-target qp-tooltip-container" au-target-id="332"> Subcontract Nbr.<!--slot--> </div> </qp-tooltip><!--anchor--> </div> <!--anchor--><!--anchor--> <!--slot--> </span> <div class="control-container no-label size-default"> <div class="au-target main-field qp-selector-control" au-target-id="235"> <div class="icon-container"></div><!--anchor--> <enhanced-compose view-model.bind="controlType || defaultControlType" config.bind="controlConfig" state.bind="controlState" value.two-way="controlState.value" control-id.bind="effectiveId" context.bind="context" proxy-expressions.bind="proxyExpressions" class="main-control au-target" au-target-id="237"> <div ref="editorDiv" tabindex="-1" class="au-target editor qp-selector" au-target-id="1036" id="edDocument-OrderNbr"> <!--anchor--> <enhanced-compose show.bind="!isDisplayMode" class="qp-editor-plugin au-target" view-model.bind="editorType" config.bind="editorConfig" value.two-way="editorValue" elem-text.from-view="editor" converter.to-view="converterType" keydown.delegate="handleKeyDown($event)" au-target-id="1044"> <!--anchor--> <!--anchor--> <!--anchor--> <input ref="elemText" autocomplete="off" autocorrect="off" maxlength.bind="config.maxLength &amp; attr" enabled.bind="config.enabled ? null : false &amp; attr" spellcheck.bind="config.spellcheck ? null : false &amp; attr" placeholder.bind="config.placeholder &amp; attr" value.bind="value | meta : converter : hasFocus : editorState : config &amp; updateTrigger : 'blur' : 'update'" keydown.trigger="processKeyDown($event)" input.delegate="processInput($event)" focus.trigger="processFocus($event)" blur.trigger="processBlur($event)" paste.delegate="processPaste($event)" class="au-target qp-text-editor" au-target-id="220" type="text" id="edDocument-OrderNbr_text" name="" tabindex="0"><!--anchor--> <!--anchor--> <qp-panel id="pnlLocaleEditor" class="au-target" au-target-id="225" template="true" style="display: none;"> <div class="qp-field-wrapper" repeat.for="translation of translations"> <span class="label-wrapper label-size-sm"> <qp-label-light caption="some" control-id="translation_some"></qp-label-light> </span> <div class="control-container size-xxl"> <qp-text-editor config.bind="{class: 'editor', id: \`translation_some\`}" value.two-way="translation.valueString"> </qp-text-editor> </div> </div> </qp-panel> <!--anchor--> <!--anchor--> </enhanced-compose> <!--anchor--> <button type="button" mousedown.capture="openSelector($event)" class="qp-field-editor__button au-target" tabindex="-1" au-target-id="1053"> <qp-icon imagesrc="svg:main@search" class="buttonsCont au-target" type="sel" au-target-id="1054"> <!--anchor--> <!--anchor--> <svg> <use href.bind="imageName &amp; attr" class="au-target" au-target-id="405" href="/src/Content/svg_icons/main.svg?c6faad4369844a607b25#search"></use> </svg><!--anchor--> <!--anchor--> </qp-icon> <!-- <div class="buttonsCont sprite-icon control-icon" icon="SelectorN" type="sel"> <div class="control-icon-img control-SelectorN"> </div> </div> --> </button><!--anchor--> </div> <qp-suggester config.bind="suggester" editor.bind="editor" rect-element.bind="editorDiv" force-open.two-way="suggesterOpen" suggest-on-blur.bind="suggestOnBlur" set-editor-value.call="setSuggestedValue(value, display, useUpdateValue)" class="au-target" au-target-id="1056"> <!--anchor--> </qp-suggester><!--anchor--> <!--anchor--> </enhanced-compose><!--anchor--> </div> <!--slot--> </div> </div> </qp-field><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--view--><qp-field control-id="edDocument-Status" control-type.bind="df.controlType" no-label.bind="df.noLabel == null ? noLabel : df.noLabel" caption.bind="df.caption" control-state.bind="state" context.bind="$this" collapsed.bind="collapsed" pinned.one-way="getFieldPinned(df)" tab-index.one-way="getFieldTabIndex(df)" name="Status" class="au-target qp-field qp-field-expanded qp-field-disabled" au-target-id="1774"> <!--anchor--> <div show.bind="controlState.visible === undefined || controlState.visible !== false" data-tooltip.bind="errorMessage" data-error-level.bind="errorLevel" data-id.bind="dataId" class="au-target wrapper" au-target-id="230" data-error-level="0" data-id="edDocument-Status"> <span class="label-wrapper no-label au-target" show.bind="!noLabel" au-target-id="231"> <!--view--> <div class="label-container"> <label for.bind="controlId" click.delegate="processClick()" ref="element" class="au-target clickable" au-target-id="601" for="edDocument-Status"> Status </label> <qp-tooltip get-visible.call="showTooltip()" class="au-target" au-target-id="603"> <div ref="contentElement" glue-to="target.bind: glueTarget; options.bind: {ignoreTargetWidth:true, centerToTarget: centerToTarget, verticalDistanceFromTargetPX:8}" style="display: none" glued.delegate="afterGlued($event)" click.capture="stopPropagation($event)" class="au-target qp-tooltip-container" au-target-id="332"> Status<!--slot--> </div> </qp-tooltip><!--anchor--> </div> <!--anchor--><!--anchor--> <!--slot--> </span> <div class="control-container no-label size-default"> <div class="au-target main-field qp-drop-down-control" au-target-id="235"> <div class="icon-container"></div><!--anchor--> <enhanced-compose view-model.bind="controlType || defaultControlType" config.bind="controlConfig" state.bind="controlState" value.two-way="controlState.value" control-id.bind="effectiveId" context.bind="context" proxy-expressions.bind="proxyExpressions" class="main-control au-target" au-target-id="237"> <div tabindex="-1" ref="editorWrap" mousedown.trigger="toggleSelector($event)" buttons.bind="ROMode ? '0' : '' &amp; attr" class="au-target drop-down__editor size- ReadOnly" au-target-id="291" id="edDocument-Status" buttons="0" style="display: block;"> <div class="editorCont"> <div class="editorWrap" title=""> <!--anchor--> <input type="text" autocomplete="off" autocorrect="off" ref="inputElement" value.bind="valueText" keydown.capture="onKeyDown($event)" keypress.delegate="onKeyPress($event)" input.delegate="onInput($event)" focus.bind="hasFocus" focus.capture="onFocus()" blur.capture="onBlur()" paste.delegate="onPaste($event)" readonly.bind="ROMode ? 'readonly' : null &amp; attr" class="au-target drop-down__display-text drop-down__invisible ReadOnly" au-target-id="294" name="$text" id="edDocument-Status_text" tabindex="-1" readonly="readonly"><span class="center"></span><span valueattr.bind="value &amp; attr" valuetextattr.bind="valueText &amp; attr" class="au-target drop-down__text ReadOnly" au-target-id="295" valuetextattr="On Hold" valueattr="H"><!--anchor-->On Hold</span> </div> </div> <div class="buttonsCont"> <span class="center"></span> <!--anchor--> <qp-icon show.bind="!ROMode" imagesrc="svg:main@treeArrowDown" type="sel" class="au-target aurelia-hide" au-target-id="301"> <!--anchor--> <!--anchor--> <svg> <use href.bind="imageName &amp; attr" class="au-target" au-target-id="405" href="/src/Content/svg_icons/main.svg?c6faad4369844a607b25#treeArrowDown"></use> </svg><!--anchor--> <!--anchor--> </qp-icon> <!-- <div class="sprite-icon control-icon" icon="DropDownN" type="sel" css="some"> <div class="control-icon-img control-DropDownN"> </div> </div> --> </div> </div> <!--anchor--> </enhanced-compose><!--anchor--> </div> <!--slot--> </div> </div> </qp-field><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--view--><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--view--><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--view--><qp-field control-id="edDocument-OrderDate" control-type.bind="df.controlType" no-label.bind="df.noLabel == null ? noLabel : df.noLabel" caption.bind="df.caption" control-state.bind="state" context.bind="$this" collapsed.bind="collapsed" pinned.one-way="getFieldPinned(df)" tab-index.one-way="getFieldTabIndex(df)" name="OrderDate" class="au-target qp-field qp-field-expanded" au-target-id="1780"> <!--anchor--> <div show.bind="controlState.visible === undefined || controlState.visible !== false" data-tooltip.bind="errorMessage" data-error-level.bind="errorLevel" data-id.bind="dataId" class="au-target wrapper req-l" au-target-id="230" data-error-level="0" data-id="edDocument-OrderDate"> <span class="label-wrapper no-label au-target" show.bind="!noLabel" au-target-id="231"> <!--view--> <div class="label-container"> <label for.bind="controlId" click.delegate="processClick()" ref="element" class="au-target clickable" au-target-id="601" for="edDocument-OrderDate"> Date </label> <qp-tooltip get-visible.call="showTooltip()" class="au-target" au-target-id="603"> <div ref="contentElement" glue-to="target.bind: glueTarget; options.bind: {ignoreTargetWidth:true, centerToTarget: centerToTarget, verticalDistanceFromTargetPX:8}" style="display: none" glued.delegate="afterGlued($event)" click.capture="stopPropagation($event)" class="au-target qp-tooltip-container" au-target-id="332"> Date<!--slot--> </div> </qp-tooltip><!--anchor--> </div> <!--anchor--><!--anchor--> <!--slot--> </span> <div class="control-container no-label size-default"> <div class="au-target main-field qp-datetime-edit-control" au-target-id="235"> <div class="icon-container"></div><!--anchor--> <enhanced-compose view-model.bind="controlType || defaultControlType" config.bind="controlConfig" state.bind="controlState" value.two-way="controlState.value" control-id.bind="effectiveId" context.bind="context" proxy-expressions.bind="proxyExpressions" class="main-control au-target" au-target-id="237"> <div buttons.bind="ROMode ? '0' : '' &amp; attr" ref="editorDiv" class="au-target qp-datetime__editor dropDown qp-datetime__width-short" au-target-id="279" id="edDocument-OrderDate" buttons="" style="display: block;"> <div class="editorCont"> <div class="editorWrap"> <input ref="elemText" type="text" keydown.capture="processKeyDown($event)" keypress.capture="processKeyPress($event)" focus.capture="processFocus($event)" blur.capture="processBlur($event)" update.capture="processUpdate($event)" beforepaste.delegate="processBeforePaste($event)" paste.delegate="processPaste($event)" selectstart.delegate="processSelectStart($event)" input.delegate="processInput($event)" value.to-view="textValue" focus.bind="focused" enabled.bind="config.enabled === false ? false : null &amp; attr" disabled.bind="ROMode" class="au-target editor" au-target-id="280" id="edDocument-OrderDate_text" name="$text" tabindex="0"> </div> </div> <div class="buttonsCont qp-calendar-opener au-target" mousedown.capture="toggleCalendar($event)" show.bind="!ROMode" au-target-id="281"> <span class="center"></span> <qp-icon imagesrc.bind="config &amp;&amp; config.timeMode ? 'svg:main@aroundTheClock' : 'svg:main@datePicker'" type="sel" class="au-target" au-target-id="282"> <!--anchor--> <!--anchor--> <svg> <use href.bind="imageName &amp; attr" class="au-target" au-target-id="405" href="/src/Content/svg_icons/main.svg?c6faad4369844a607b25#datePicker"></use> </svg><!--anchor--> <!--anchor--> </qp-icon> <!-- <div class="sprite-icon control-icon" icon="DropDownN" type="sel" css="some"> <div class="control-icon-img control-DropDownN"> </div> </div> --> </div> </div> <!--anchor--> </enhanced-compose><!--anchor--> </div> <!--slot--> </div> </div> </qp-field><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--view--><qp-field control-id="edDocument-ExpectedDate" control-type.bind="df.controlType" no-label.bind="df.noLabel == null ? noLabel : df.noLabel" caption.bind="df.caption" control-state.bind="state" context.bind="$this" collapsed.bind="collapsed" pinned.one-way="getFieldPinned(df)" tab-index.one-way="getFieldTabIndex(df)" name="ExpectedDate" class="au-target qp-field qp-field-expanded" au-target-id="1782"> <!--anchor--> <div show.bind="controlState.visible === undefined || controlState.visible !== false" data-tooltip.bind="errorMessage" data-error-level.bind="errorLevel" data-id.bind="dataId" class="au-target wrapper" au-target-id="230" data-error-level="0" data-id="edDocument-ExpectedDate"> <span class="label-wrapper no-label au-target" show.bind="!noLabel" au-target-id="231"> <!--view--> <div class="label-container"> <label for.bind="controlId" click.delegate="processClick()" ref="element" class="au-target clickable" au-target-id="601" for="edDocument-ExpectedDate"> Start Date </label> <qp-tooltip get-visible.call="showTooltip()" class="au-target" au-target-id="603"> <div ref="contentElement" glue-to="target.bind: glueTarget; options.bind: {ignoreTargetWidth:true, centerToTarget: centerToTarget, verticalDistanceFromTargetPX:8}" style="display: none" glued.delegate="afterGlued($event)" click.capture="stopPropagation($event)" class="au-target qp-tooltip-container" au-target-id="332"> Start Date<!--slot--> </div> </qp-tooltip><!--anchor--> </div> <!--anchor--><!--anchor--> <!--slot--> </span> <div class="control-container no-label size-default"> <div class="au-target main-field qp-datetime-edit-control" au-target-id="235"> <div class="icon-container"></div><!--anchor--> <enhanced-compose view-model.bind="controlType || defaultControlType" config.bind="controlConfig" state.bind="controlState" value.two-way="controlState.value" control-id.bind="effectiveId" context.bind="context" proxy-expressions.bind="proxyExpressions" class="main-control au-target" au-target-id="237"> <div buttons.bind="ROMode ? '0' : '' &amp; attr" ref="editorDiv" class="au-target qp-datetime__editor dropDown qp-datetime__width-short" au-target-id="279" id="edDocument-ExpectedDate" buttons="" style="display: block;"> <div class="editorCont"> <div class="editorWrap"> <input ref="elemText" type="text" keydown.capture="processKeyDown($event)" keypress.capture="processKeyPress($event)" focus.capture="processFocus($event)" blur.capture="processBlur($event)" update.capture="processUpdate($event)" beforepaste.delegate="processBeforePaste($event)" paste.delegate="processPaste($event)" selectstart.delegate="processSelectStart($event)" input.delegate="processInput($event)" value.to-view="textValue" focus.bind="focused" enabled.bind="config.enabled === false ? false : null &amp; attr" disabled.bind="ROMode" class="au-target editor" au-target-id="280" id="edDocument-ExpectedDate_text" name="$text" tabindex="0"> </div> </div> <div class="buttonsCont qp-calendar-opener au-target" mousedown.capture="toggleCalendar($event)" show.bind="!ROMode" au-target-id="281"> <span class="center"></span> <qp-icon imagesrc.bind="config &amp;&amp; config.timeMode ? 'svg:main@aroundTheClock' : 'svg:main@datePicker'" type="sel" class="au-target" au-target-id="282"> <!--anchor--> <!--anchor--> <svg> <use href.bind="imageName &amp; attr" class="au-target" au-target-id="405" href="/src/Content/svg_icons/main.svg?c6faad4369844a607b25#datePicker"></use> </svg><!--anchor--> <!--anchor--> </qp-icon> <!-- <div class="sprite-icon control-icon" icon="DropDownN" type="sel" css="some"> <div class="control-icon-img control-DropDownN"> </div> </div> --> </div> </div> <!--anchor--> </enhanced-compose><!--anchor--> </div> <!--slot--> </div> </div> </qp-field><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--view--><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--view--><qp-field control-id="edDocument-VendorRefNbr" control-type.bind="df.controlType" no-label.bind="df.noLabel == null ? noLabel : df.noLabel" caption.bind="df.caption" control-state.bind="state" context.bind="$this" collapsed.bind="collapsed" pinned.one-way="getFieldPinned(df)" tab-index.one-way="getFieldTabIndex(df)" name="VendorRefNbr" class="au-target qp-field qp-field-expanded" au-target-id="1786"> <!--anchor--> <div show.bind="controlState.visible === undefined || controlState.visible !== false" data-tooltip.bind="errorMessage" data-error-level.bind="errorLevel" data-id.bind="dataId" class="au-target wrapper qp-field-empty" au-target-id="230" data-error-level="0" data-id="edDocument-VendorRefNbr"> <span class="label-wrapper no-label au-target" show.bind="!noLabel" au-target-id="231"> <!--view--> <div class="label-container"> <label for.bind="controlId" click.delegate="processClick()" ref="element" class="au-target clickable" au-target-id="601" for="edDocument-VendorRefNbr"> Vendor Ref. </label> <qp-tooltip get-visible.call="showTooltip()" class="au-target" au-target-id="603"> <div ref="contentElement" glue-to="target.bind: glueTarget; options.bind: {ignoreTargetWidth:true, centerToTarget: centerToTarget, verticalDistanceFromTargetPX:8}" style="display: none" glued.delegate="afterGlued($event)" click.capture="stopPropagation($event)" class="au-target qp-tooltip-container" au-target-id="332"> Vendor Ref.<!--slot--> </div> </qp-tooltip><!--anchor--> </div> <!--anchor--><!--anchor--> <!--slot--> </span> <div class="control-container no-label size-default"> <div class="au-target main-field qp-text-editor-control" au-target-id="235"> <div class="icon-container"></div><!--anchor--> <enhanced-compose view-model.bind="controlType || defaultControlType" config.bind="controlConfig" state.bind="controlState" value.two-way="controlState.value" control-id.bind="effectiveId" context.bind="context" proxy-expressions.bind="proxyExpressions" class="main-control au-target" au-target-id="237"> <!--anchor--> <!--anchor--> <!--anchor--> <input ref="elemText" autocomplete="off" autocorrect="off" maxlength.bind="config.maxLength &amp; attr" enabled.bind="config.enabled ? null : false &amp; attr" spellcheck.bind="config.spellcheck ? null : false &amp; attr" placeholder.bind="config.placeholder &amp; attr" value.bind="value | meta : converter : hasFocus : editorState : config &amp; updateTrigger : 'blur' : 'update'" keydown.trigger="processKeyDown($event)" input.delegate="processInput($event)" focus.trigger="processFocus($event)" blur.trigger="processBlur($event)" paste.delegate="processPaste($event)" class="au-target qp-text-editor" au-target-id="220" type="text" id="edDocument-VendorRefNbr" name="" tabindex="0" maxlength="40"><!--anchor--> <!--anchor--> <qp-panel id="pnlLocaleEditor" class="au-target" au-target-id="225" template="true" style="display: none;"> <div class="qp-field-wrapper" repeat.for="translation of translations"> <span class="label-wrapper label-size-sm"> <qp-label-light caption="some" control-id="translation_some"></qp-label-light> </span> <div class="control-container size-xxl"> <qp-text-editor config.bind="{class: 'editor', id: \`translation_some\`}" value.two-way="translation.valueString"> </qp-text-editor> </div> </div> </qp-panel> <!--anchor--> <!--anchor--> </enhanced-compose><!--anchor--> </div> <!--slot--> </div> </div> </qp-field><!--anchor--><!--anchor--> <!--anchor--> <!--anchor--> <!--anchor--> <!--anchor--> <!--anchor--> <!--anchor--> </fieldset><!--anchor--> <!--anchor--> </qp-fieldset></div>`

        const actual = await sut.parse(elementHtml);

        const qpField1: QPField = {
            Label: ' Subcontract Nbr. ',
            Type: AcuElementType.QPField,
            Value: null,
            ElementType: QPFieldElementType.TextEditor,
        }

        const qpField2: QPField = {
            Label: ' Status ',
            Type: AcuElementType.QPField,
            Value: null,
            ElementType: QPFieldElementType.TextEditor,
        }

        const qpField3: QPField = {
            Label: ' Date ',
            Type: AcuElementType.QPField,
            Value: null,
            ElementType: QPFieldElementType.TextEditor,
        }

        const qpField4: QPField = {
            Label: ' Start Date ',
            Type: AcuElementType.QPField,
            Value: null,
            ElementType: QPFieldElementType.TextEditor,
        }

        const qpField5: QPField = {
            Label: ' Vendor Ref. ',
            Type: AcuElementType.QPField,
            Value: null,
            ElementType: QPFieldElementType.TextEditor,
        }

        const qpFieldset: QPFieldset = {
            Type: AcuElementType.QPFieldSet,
            Children: [qpField1, qpField2, qpField3, qpField4, qpField5],
        }

        const expected: AcuContainer = {
            Type: AcuElementType.Root,
            Children: [qpFieldset],
        }
        expect(actual).toEqual(expected)
    });
});