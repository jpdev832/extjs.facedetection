/********************************
 *
 * Face detection class
 *
 ********************************/
Ext.define('FaceDetection.utils.FaceDetection',{
    extend: 'Ext.Base',
    
    requires: [
        'FaceDetection.utils.CCV',
        'FaceDetection.utils.FaceCascade'
    ],
    
    config: {
        confidence: null
    },
    
    /**
     * Convert <image> source to grayscale using html canvas
     * 
     * @param image <image> html image element
     * @return Canvas <Canvas> html element
     */
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

    /**
     * Detect faces from Ext.Image component
     *
     * @param imageComponent Ext.Image component
     * @return Array array containing face information
     */
    detect: function (imageComponent) {
        var image = imageComponent.imageObject;
        image.crossOrigin = 'Anonymous';
        var cascade = FaceDetection.utils.FaceCascade.cascade;
        var ccv = Ext.create('FaceDetection.utils.CCV', { cascade: cascade } );
        var imgCanvas = this.grayscale(image);
        try {
            var coords = ccv.detect_objects(imgCanvas, cascade, 5, 1);
        } catch(e) {
            return [];
        }

        //need to fix positions from component
        var positionX 	= imageComponent.getLeft();
        var positionY 	= imageComponent.getTop();	
        var offsetX 	= imageComponent.getLeft() - imageComponent.getParent().getLeft();
        var offsetY 	= imageComponent.getTop() - imageComponent.getParent().getTop();
        var newCoords 	= [];

        var subCanvas = document.createElement("canvas");
        var subCtx = subCanvas.getContext("2d");
        for (var i = 0; i < coords.length; i++) {
            if (this.confidence == null || coords[i].confidence >= this.confidence) {
                var x      = Math.round(coords[i].x);
                var y      = Math.round(coords[i].y);
                var width  = Math.round(coords[i].width);
                var height = Math.round(coords[i].height);
                
                subCanvas.width  = width;
                subCanvas.height = height;

                subCtx.drawImage(image, x, y, width, height, 0, 0, width, height);
                var imgUrl = subCanvas.toDataURL();
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
                    neighbour:	coords[i].neighbour,
                    subImgUrl:  imgUrl
                });
            }
        }
        return newCoords;
    }
});