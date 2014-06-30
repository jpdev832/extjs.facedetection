Ext.define('FaceDetection.controller.Main', {
    extend: 'Ext.app.Controller',
    
    requires: [
        'FaceDetection.view.Main',
        'FaceDetection.utils.FaceCascade',
        'FaceDetection.utils.FaceDetection'
    ],
    
    config: {
        refs: {
            mainView: 'main',
            
            btnDetect: 'main button[action=detect]',
            imgDetect: 'main image[name=imgDetect]'
        },
        control: {
            btnDetect: {
                tap: 'onDetect'   
            }
        }
    },
    
    onDetect: function(){
        var faceStore = Ext.getStore('Face');
        
        console.log('detection in progress');
        var startTime = new Date().getTime();
        
        var img = this.getImgDetect();
        var detector = Ext.create('FaceDetection.utils.FaceDetection');
        var coords = detector.detect(img);
        
        var endTime = new Date().getTime();
        var elapsed = endTime - startTime;
        console.log('finished detection: '+elapsed);
        
        for( var i=0; i<coords.length; i++ )
        {
            faceStore.add( { faceSrc: coords[i].subImgUrl } );   
        }
        faceStore.sync();
    }
});