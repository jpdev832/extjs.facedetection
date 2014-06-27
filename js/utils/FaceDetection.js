Ext.define('FaceTest.utils.FaceDetection',{
    extend: 'Ext.Base',
    
    requires: [
        'FaceTest.utils.CCV',
        'FaceTest.utils.FaceCascade'
    ],
    
    config: {
        confidence: null
    },
    
    // Grayscale function by Liu Liu
	grayscale: function (image) {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");

        canvas.width  = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0);
        var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        var data = imageData.data;
        var pix1, pix2, pix = canvas.width * canvas.height * 4;
        while (pix > 0) {
            data[pix -= 4] = data[pix1 = pix + 1] = data[pix2 = pix + 2] = (data[pix] * 0.3 + data[pix1] * 0.59 + data[pix2] * 0.11);
        }
        ctx.putImageData(imageData, 0, 0);
        return canvas;
    },

    detect: function (imageComponent) {
        var image = imageComponent.imageObject;
        var cascade = FaceTest.utils.FaceCascade.cascade;
        var ccv = Ext.create('FaceTest.utils.CCV', { cascade: cascade } );
        try {
            var coords = ccv.detect_objects(this.grayscale(image), cascade, 5, 1);
        } catch(e) {
            return [];
        }

        //need to fix positions from component
        var positionX 	= imageComponent.getLeft();
        var positionY 	= imageComponent.getTop();	
        var offsetX 	= imageComponent.getLeft() - imageComponent.getParent().getLeft();
        var offsetY 	= imageComponent.getTop() - imageComponent.getParent().getTop();
        var newCoords 	= [];

        for (var i = 0; i < coords.length; i++) {
            if (this.confidence == null || coords[i].confidence >= this.confidence) {
                newCoords.push({
                    x:			Math.round(coords[i].x),
                    y:			Math.round(coords[i].y),
                    width:		Math.round(coords[i].width),
                    height:		Math.round(coords[i].height),
                    positionX:	positionX + coords[i].x,
                    positionY:	positionY + coords[i].y,
                    offsetX:	offsetX + coords[i].x,
                    offsetY:	offsetY + coords[i].y,
                    confidence:	coords[i].confidence,
                    neighbour:	coords[i].neighbour
                });
            }
        }
        return newCoords;
    }
});