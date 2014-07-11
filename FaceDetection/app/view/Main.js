Ext.define('FaceDetection.view.Main', {
    extend: 'Ext.Panel',
    xtype: 'main',
    requires: [
        'Ext.TitleBar',
        'Ext.field.Url',
        'Ext.dataview.DataView',
        'Ext.Img'
    ],
    config: {
        items: [ 
            {
                xtype: 'titlebar',
                docked: 'top',
                title: 'Face Detection Test'
            },
            {
                xtype: 'button',
                text: 'Detect',
                name: 'btnDetect',
                action: 'detect'
            },
            {
                xtype: 'container',
                layout: {
                    type: 'hbox',
                    align: 'stretch'
                },
                items: [
                    {
                        xtype: 'image',
                        src: '../../images/test2.jpg',
                        name: 'imgDetect',
                        width: 400,
                        height: 400
                    },
                    {
                        xtype: 'dataview',
                        width: 600,
                        height: 500,
                        margin: 20,
                        scrollable: {
                            direction: 'vertical'   
                        },
                        itemTpl: "<div><img src='{faceSrc}' /><p>Confidence: {confidence}</p><hr></div>",
                        store: 'Face'
                    }
                ]
            }
        ]
    }
});
