(() => {
    let $counter = $('#counter');
    let $title = $('#title');
    let $message = $('#message');

    const getData = (settings) => {
        let deferreds = [];

        deferreds.push(calculateElement(settings.aElementType, settings.aElementNumber, settings.aElementQuery, settings.aElementQueryType, settings.aElementQueryFieldNumber));
        deferreds.push(calculateElement(settings.bElementType, settings.bElementNumber, settings.bElementQuery, settings.bElementQueryType, settings.bElementQueryFieldNumber));
        deferreds.push(calculateElement(settings.cElementType, settings.cElementNumber, settings.cElementQuery, settings.cElementQueryType, settings.cElementQueryFieldNumber));

        Promise.all(deferreds).then(result => {
            let aElement = result[0];
            let bElement = result[1];
            let cElement = result[2];

            if (aElement == 0 && bElement == 0 && cElement == 0) {
                $counter.text('-');
                $message.text('');

            } else {
                if (aElement == 0) {
                    $counter.text('Err /0');

                } else {
                    let xElement = bElement * cElement / aElement;

                    $counter.text(xElement.toFixed(settings.xDecimalPlaces) + settings.xUnitType);
                }

                $message.text(`A = ${aElement}; B = ${bElement}; C = ${cElement}`);
            }
        });
    };

    const getSettings = (widgetSettings) => {
        let settings = JSON.parse(widgetSettings.customSettings.data);

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

    const load = (widgetSettings) => {
        let settings = getSettings(widgetSettings);

        $title.text(settings.title);
        getData(settings);
    };

    const calculateElement = (elementType, elementNumber, elementQuery, elementQueryType, elementQueryFieldNumber) => {
        let deferred = $.Deferred();

        if (elementType == '0') {
            deferred.resolve(parseFloat(elementNumber));

        } else {
            AzureDevOps.Queries.getById(elementQuery).then(query => {
                AzureDevOps.Queries.getItems(query).then(items => {
                    if (elementQueryType == '0') {
                        deferred.resolve(items.length);

                    } else {
                        deferred.resolve(items.map(item => item[elementQueryFieldNumber]).reduce((a, b) => a + b, 0));
                    }
                });
            });
        }

        return deferred.promise();
    };

    window.LoadWidget = load;
})();