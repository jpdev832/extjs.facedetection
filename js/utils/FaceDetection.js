Ext.define('FaceTest.utils.FaceDetection',{
    extend: 'Ext.Base',
    
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
        debugger;
        var image = imageComponent.getContentEl().dom;
        try {
            var coords = ccv.detect_objects(grayscale(image), cascade, 5, 1);
        } catch(e) {
            return [];
        }

        var positionX 	= imageComponent.left;
        var positionY 	= imageComponent.top;	
        var offsetX 	= imageComponent.left - imageComponent.getParent().left;
        var offsetY 	= imageComponent.top - imageComponent.getParent().top;
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