Ext.define('FaceDetection.model.Face', {
    extend: 'Ext.data.Model',
    
    config: {
        fields: [
            { name: 'faceSrc', type: 'auto' },
            { name: 'confidence', type: 'auto' }
        ]
    }
});
