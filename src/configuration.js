(() => {
    let $context = null;
    let $widgetEvent = null;
    
    let $title = $('#title');

    let $aElementType = $('#a-element-type');
    let $aElementNumber = $('#a-element-number');
    let $aElementQuery = $('#a-element-query');
    let $aElementQueryType = $('#a-element-query-type');
    let $aElementQueryFieldNumber = $('#a-element-query-field-number');

    let $bElementType = $('#b-element-type');
    let $bElementNumber = $('#b-element-number');
    let $bElementQuery = $('#b-element-query');
    let $bElementQueryType = $('#b-element-query-type');
    let $bElementQueryFieldNumber = $('#b-element-query-field-number');

    let $cElementType = $('#c-element-type');
    let $cElementNumber = $('#c-element-number');
    let $cElementQuery = $('#c-element-query');
    let $cElementQueryType = $('#c-element-query-type');
    let $cElementQueryFieldNumber = $('#c-element-query-field-number');

    let $xUnitType = $('#x-unit-type');
    let $xDecimalPlaces = $('#x-decimal-places');

    let $aElementNumberArea = $('#a-element-number-area');
    let $aElementQueryArea = $('#a-element-query-area');
    let $aElementQueryTypeArea = $('#a-element-query-type-area');
    let $aElementQueryFieldNumberArea = $('#a-element-query-field-number-area');

    let $bElementNumberArea = $('#b-element-number-area');
    let $bElementQueryArea = $('#b-element-query-area');
    let $bElementQueryTypeArea = $('#b-element-query-type-area');
    let $bElementQueryFieldNumberArea = $('#b-element-query-field-number-area');

    let $cElementNumberArea = $('#c-element-number-area');
    let $cElementQueryArea = $('#c-element-query-area');
    let $cElementQueryTypeArea = $('#c-element-query-type-area');
    let $cElementQueryFieldNumberArea = $('#c-element-query-field-number-area');

    const addQueryToSelect = (elementQuery, query, level) => {
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

    const changeSettings = () => {
        var eventName = $widgetEvent.ConfigurationChange;
        var eventArgs = $widgetEvent.Args(getSettingsToSave());
        $context.notify(eventName, eventArgs);
    };

    const elementQueryChange = (elementQuery, elementQueryFieldNumber) => {
        let deferred = $.Deferred();

        AzureDevOps.Queries.getFields(elementQuery.val()).then((fields) => {
            elementQueryFieldNumber.html('');

            fields
                .filter(field => field.type == 7)
                .forEach(field => {
                    elementQueryFieldNumber.append($('<option>')
                        .val(field.referenceName)
                        .html(field.name));
                });

            deferred.resolve();
        });

        return deferred.promise();
    };

    const elementQueryTypeChange = (elementQueryType, elementQueryFieldNumberArea) => {
        if (elementQueryType.val() == '0') {
            elementQueryFieldNumberArea.hide();
        } else {
            elementQueryFieldNumberArea.show();
        }
    };

    const elementTypeChange = (elementType, elementNumberArea, elementQueryArea, elementQueryType, elementQueryTypeArea, elementQueryFieldNumberArea) => {
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

    const getSettings = (widgetSettings) => {
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

    const getSettingsToSave = () => {
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

    const loadConfiguration = (settings, context, widgetEvent) => {
        $context = context;
        $widgetEvent = widgetEvent;

        prepareControls(getSettings(settings));
    };

    const prepareControls = (settings) => {
        AzureDevOps.Queries.getAllShared().then(queries => {
            $title.on('change', changeSettings);

            prepareElementControls(queries, $aElementType, $aElementNumberArea, $aElementNumber, $aElementQueryArea, $aElementQuery, $aElementQueryType, $aElementQueryTypeArea, $aElementQueryFieldNumberArea, $aElementQueryFieldNumber);
            prepareElementControls(queries, $bElementType, $bElementNumberArea, $bElementNumber, $bElementQueryArea, $bElementQuery, $bElementQueryType, $bElementQueryTypeArea, $bElementQueryFieldNumberArea, $bElementQueryFieldNumber);
            prepareElementControls(queries, $cElementType, $cElementNumberArea, $cElementNumber, $cElementQueryArea, $cElementQuery, $cElementQueryType, $cElementQueryTypeArea, $cElementQueryFieldNumberArea, $cElementQueryFieldNumber);

            $xUnitType.on('change', changeSettings);
            $xDecimalPlaces.on('change', changeSettings);

            setValues(settings);
        });
    };

    const prepareElementControls = (queries, elementType, elementNumberArea, elementNumber, elementQueryArea, elementQuery, elementQueryType, elementQueryTypeArea, elementQueryFieldNumberArea, elementQueryFieldNumber) => {
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

    const setValues = (settings) => {
        setTimeout(() => {
            $title.val(settings.title);

            $aElementType.val(settings.aElementType);
            elementTypeChange($aElementType, $aElementNumberArea, $aElementQueryArea, $aElementQueryType, $aElementQueryTypeArea, $aElementQueryFieldNumberArea);
            $aElementNumber.val(settings.aElementNumber);
            $aElementQuery.val(settings.aElementQuery);
            elementQueryChange($aElementQuery, $aElementQueryFieldNumber).then(_ => {
                $aElementQueryFieldNumber.val(settings.aElementQueryFieldNumber);
            });
            $aElementQueryType.val(settings.aElementQueryType);
            elementQueryTypeChange($aElementQueryType, $aElementQueryFieldNumberArea);

            $bElementType.val(settings.bElementType);
            elementTypeChange($bElementType, $bElementNumberArea, $bElementQueryArea, $bElementQueryType, $bElementQueryTypeArea, $bElementQueryFieldNumberArea);
            $bElementNumber.val(settings.bElementNumber);
            $bElementQuery.val(settings.bElementQuery);
            elementQueryChange($bElementQuery, $bElementQueryFieldNumber).then(_ => {
                $bElementQueryFieldNumber.val(settings.bElementQueryFieldNumber);
            });
            $bElementQueryType.val(settings.bElementQueryType);
            elementQueryTypeChange($bElementQueryType, $bElementQueryFieldNumberArea);

            $cElementType.val(settings.cElementType);
            elementTypeChange($cElementType, $cElementNumberArea, $cElementQueryArea, $cElementQueryType, $cElementQueryTypeArea, $cElementQueryFieldNumberArea);
            $cElementNumber.val(settings.cElementNumber);
            $cElementQuery.val(settings.cElementQuery);
            elementQueryChange($cElementQuery, $cElementQueryFieldNumber).then(_ => {
                $cElementQueryFieldNumber.val(settings.cElementQueryFieldNumber);
            });
            $cElementQueryType.val(settings.cElementQueryType);
            elementQueryTypeChange($cElementQueryType, $cElementQueryFieldNumberArea);

            $xUnitType.val(settings.xUnitType);
            $xDecimalPlaces.val(settings.xDecimalPlaces);        
        }, 500);
    };

    window.LoadConfiguration = loadConfiguration;
    window.GetSettingsToSave = getSettingsToSave;    
})();