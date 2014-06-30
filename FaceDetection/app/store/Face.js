Ext.define('FaceDetection.store.Face', {
    extend: 'Ext.data.Store',
    
    config: {
        model: 'FaceDetection.model.Face',
        proxy: {
            type: 'memory',
            id: 'face_data'
        },
        reader: {
            type: 'json'   
        }
    }
});