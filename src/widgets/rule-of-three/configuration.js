(() => {
    /* PUBLIC */
    window.WidgetConfiguration = {
        init: (WidgetHelpers) => {
            widgetHelpers = WidgetHelpers;
        },

        load: (widgetSettings, widgetConfigurationContext) => {
            context = widgetConfigurationContext;

            var settings = getSettings(widgetSettings);
            prepareControls(settings).then(_ => {
                loadSettings(settings);    
            });

            return widgetHelpers.WidgetStatusHelper.Success();
        },

        save: (widgetSettings) => {
            return widgetHelpers.WidgetConfigurationSave.Valid(getSettingsToSave());
        }
    };

    /* PRIVATE */
    var context;
    var widgetHelpers;

    var $title = $('#title');

    var $aElementType = $('#a-element-type');
    var $aElementNumber = $('#a-element-number');
    var $aElementQuery = $('#a-element-query');
    var $aElementQueryType = $('#a-element-query-type');
    var $aElementQueryFieldNumber = $('#a-element-query-field-number');

    var $bElementType = $('#b-element-type');
    var $bElementNumber = $('#b-element-number');
    var $bElementQuery = $('#b-element-query');
    var $bElementQueryType = $('#b-element-query-type');
    var $bElementQueryFieldNumber = $('#b-element-query-field-number');

    var $cElementType = $('#c-element-type');
    var $cElementNumber = $('#c-element-number');
    var $cElementQuery = $('#c-element-query');
    var $cElementQueryType = $('#c-element-query-type');
    var $cElementQueryFieldNumber = $('#c-element-query-field-number');

    var $xUnitType = $('#x-unit-type');
    var $xDecimalPlaces = $('#x-decimal-places');

    var $aElementNumberArea = $('#a-element-number-area');
    var $aElementQueryArea = $('#a-element-query-area');
    var $aElementQueryTypeArea = $('#a-element-query-type-area');
    var $aElementQueryFieldNumberArea = $('#a-element-query-field-number-area');

    var $bElementNumberArea = $('#b-element-number-area');
    var $bElementQueryArea = $('#b-element-query-area');
    var $bElementQueryTypeArea = $('#b-element-query-type-area');
    var $bElementQueryFieldNumberArea = $('#b-element-query-field-number-area');

    var $cElementNumberArea = $('#c-element-number-area');
    var $cElementQueryArea = $('#c-element-query-area');
    var $cElementQueryTypeArea = $('#c-element-query-type-area');
    var $cElementQueryFieldNumberArea = $('#c-element-query-field-number-area');

    var $xUnitType = $('#x-unit-type');
    var $xDecimalPlaces = $('#x-decimal-places');

    var addQueryToSelect = (elementQuery, query, level) => {
        level = level ?? 0;

        if (query.isFolder ?? false) {
            elementQuery.append($('<option>')
                .val(query.id)
                .html('&nbsp;&nbsp;'.repeat(level) + query.name)
                .attr('data-level', '0')
                .css('font-weight', 'bold')
                .attr('disabled', 'disabled'));

            if (query.children.length > 0)
            {
                query.children.forEach(innerQuery => {
                    addQueryToSelect(elementQuery, innerQuery, level + 1);
                });
            }

        } else {
            elementQuery.append($('<option>')
                .val(query.id)
                .html('&nbsp;&nbsp;'.repeat(level) + query.name)
                .attr('data-level', level));
        }
    };

    var elementQueryChange = (elementQuery, elementQueryFieldNumber) => {
        var deferred = $.Deferred();

        window.AzureDevOpsProxy.getQueryNumberFields(elementQuery.val()).then((fields) => {
            elementQueryFieldNumber.html('');

            fields.forEach(field => {
                elementQueryFieldNumber.append($('<option>')
                    .val(field.referenceName)
                    .html(field.name));
            });

            deferred.resolve();
        });

        return deferred.promise();
    };

    var elementTypeChange = (elementType, elementNumberArea, elementQueryArea, elementQueryType, elementQueryTypeArea, elementQueryFieldNumberArea) => {
        if (elementType.val() == '0') {
            elementNumberArea.show();
            elementQueryArea.hide();
            elementQueryTypeArea.hide();
            elementQueryFieldNumberArea.hide();
        } else {
            elementNumberArea.hide();
            elementQueryArea.show();
            elementQueryTypeArea.show();
            elementQueryFieldNumberArea.show();
        }

        elementQueryTypeChange(elementQueryType, elementQueryFieldNumberArea);
    };

    var elementQueryTypeChange = (elementQueryType, elementQueryFieldNumberArea) => {
        if (elementQueryType.val() == '0') {
            elementQueryFieldNumberArea.hide();
        } else {
            elementQueryFieldNumberArea.show();
        }
    };

    var changeSettings = () => {
        settings = getSettingsToSave();

        var eventName = widgetHelpers.WidgetEvent.ConfigurationChange;
        var eventArgs = widgetHelpers.WidgetEvent.Args(settings);
        context.notify(eventName, eventArgs);
    };

    var loadSettings = (settings) => {
        setTimeout(() => {
            $title.val(settings.title);

            $aElementType.val(settings.aElementType);
            elementTypeChange($aElementType, $aElementNumberArea, $aElementQueryArea, $aElementQueryType, $aElementQueryTypeArea, $aElementQueryFieldNumberArea);
            $aElementNumber.val(settings.aElementNumber);
            $aElementQuery.val(settings.aElementQuery);
            $aElementQueryType.val(settings.aElementQueryType);
            elementQueryTypeChange($aElementQueryType, $aElementQueryFieldNumberArea);
            $aElementQueryFieldNumber.val(settings.aElementQueryFieldNumber);

            $bElementType.val(settings.bElementType);
            elementTypeChange($bElementType, $bElementNumberArea, $bElementQueryArea, $bElementQueryType, $bElementQueryTypeArea, $bElementQueryFieldNumberArea);
            $bElementNumber.val(settings.bElementNumber);
            $bElementQuery.val(settings.bElementQuery);
            $bElementQueryType.val(settings.bElementQueryType);
            elementQueryTypeChange($bElementQueryType, $bElementQueryFieldNumberArea);
            $bElementQueryFieldNumber.val(settings.bElementQueryFieldNumber);

            $cElementType.val(settings.cElementType);
            elementTypeChange($cElementType, $cElementNumberArea, $cElementQueryArea, $cElementQueryType, $cElementQueryTypeArea, $cElementQueryFieldNumberArea);
            $cElementNumber.val(settings.cElementNumber);
            $cElementQuery.val(settings.cElementQuery);
            $cElementQueryType.val(settings.cElementQueryType);
            elementQueryTypeChange($cElementQueryType, $cElementQueryFieldNumberArea);
            $cElementQueryFieldNumber.val(settings.cElementQueryFieldNumber);

            $xUnitType.val(settings.xUnitType);
            $xDecimalPlaces.val(settings.xDecimalPlaces);        
        }, 500);
    };

    var getSettings = (widgetSettings) => {
        var settings = JSON.parse(widgetSettings.customSettings.data);

        return {
            title: settings?.title ?? 'Rule of Three',
            aElementType: settings?.aElementType ?? '0',
            aElementNumber: settings?.aElementNumber ?? '0',
            aElementQuery: settings?.aElementQuery ?? '',
            aElementQueryType: settings?.aElementQueryType ?? '0',
            aElementQueryFieldNumber: settings?.aElementQueryFieldNumber ?? '',

            bElementType: settings?.bElementType ?? '0',
            bElementNumber: settings?.bElementNumber ?? '0',
            bElementQuery: settings?.bElementQuery ?? '',
            bElementQueryType: settings?.bElementQueryType ?? '0',
            bElementQueryFieldNumber: settings?.bElementQueryFieldNumber ?? '',

            cElementType: settings?.cElementType ?? '0',
            cElementNumber: settings?.cElementNumber ?? '0',
            cElementQuery: settings?.cElementQuery ?? '',
            cElementQueryType: settings?.cElementQueryType ?? '0',
            cElementQueryFieldNumber: settings?.cElementQueryFieldNumber ?? '',

            xUnitType: settings?.xUnitType ?? '',
            xDecimalPlaces: settings?.xDecimalPlaces ?? '0'
        };
    };

    var getSettingsToSave = () => {
        return {
            data: JSON.stringify({
                title: $title.val(),
                aElementType: $aElementType.val(),
                aElementNumber: $aElementNumber.val(),
                aElementQuery: $aElementQuery.val(),
                aElementQueryType: $aElementQueryType.val(),
                aElementQueryFieldNumber: $aElementQueryFieldNumber.val(),

                bElementType: $bElementType.val(),
                bElementNumber: $bElementNumber.val(),
                bElementQuery: $bElementQuery.val(),
                bElementQueryType: $bElementQueryType.val(),
                bElementQueryFieldNumber: $bElementQueryFieldNumber.val(),

                cElementType: $cElementType.val(),
                cElementNumber: $cElementNumber.val(),
                cElementQuery: $cElementQuery.val(),
                cElementQueryType: $cElementQueryType.val(),
                cElementQueryFieldNumber: $cElementQueryFieldNumber.val(),

                xUnitType: $xUnitType.val(),
                xDecimalPlaces: $xDecimalPlaces.val()
            })
        };
    };

    var prepareControls = () => {
        var deferred = $.Deferred();

        window.AzureDevOpsProxy.getSharedQueries().then(queries => {
            $title.on('change', changeSettings);

            prepareElementControls(queries, $aElementType, $aElementNumberArea, $aElementNumber, $aElementQueryArea, $aElementQuery, $aElementQueryType, $aElementQueryTypeArea, $aElementQueryFieldNumberArea, $aElementQueryFieldNumber);
            prepareElementControls(queries, $bElementType, $bElementNumberArea, $bElementNumber, $bElementQueryArea, $bElementQuery, $bElementQueryType, $bElementQueryTypeArea, $bElementQueryFieldNumberArea, $bElementQueryFieldNumber);
            prepareElementControls(queries, $cElementType, $cElementNumberArea, $cElementNumber, $cElementQueryArea, $cElementQuery, $cElementQueryType, $cElementQueryTypeArea, $cElementQueryFieldNumberArea, $cElementQueryFieldNumber);

            $xUnitType.on('change', changeSettings);
            $xDecimalPlaces.on('change', changeSettings);

            deferred.resolve();
        });

        return deferred.promise();
    };

    var prepareElementControls = (queries, elementType, elementNumberArea, elementNumber, elementQueryArea, elementQuery, elementQueryType, elementQueryTypeArea, elementQueryFieldNumberArea, elementQueryFieldNumber) => {
        elementType.on('change', () => {
            elementTypeChange(elementType, elementNumberArea, elementQueryArea, elementQuery, elementQueryType, elementQueryTypeArea, elementQueryFieldNumberArea);
            changeSettings();
        });

        elementNumber.on('change', changeSettings);

        queries.forEach(query => addQueryToSelect(elementQuery, query));
        elementQuery.on('change', () => {
            elementQueryChange(elementQuery, elementQueryFieldNumber);
            changeSettings();
        });

        elementQueryType.on('change', () => {
            elementQueryTypeChange(elementQueryType, elementQueryFieldNumberArea);
            changeSettings();
        });

        elementQueryFieldNumber.on('change', changeSettings);
    };
})();