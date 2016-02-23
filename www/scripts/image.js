(function (global) {
    var ImageViewModel,
        pictureSource,// picture source
        destinationType, // sets the format of returned value 
        app = global.app = global.app || {};
   
    ImageViewModel = kendo.data.ObservableObject.extend({
       
        // Called when a photo is successfully retrieved
        //
 
        onPhotoDataSuccess: function (imageData) {
            // Uncomment to view the base64 encoded image data
            // ////console.log(imageData);

            // Get image handle
            //
            var smallImage = document.getElementById('smallImage');

            // Unhide image elements
            //
            smallImage.style.display = 'block';

            // Show the captured photo
            // The inline CSS rules are used to resize the image
            //
            smallImage.src = "data:image/jpeg;base64," + imageData;
        },
        // Called when a photo is successfully retrieved
        //
        onPhotoURISuccess: function (imageURI) {
            // Uncomment to view the image file URI 
            // ////console.log(imageURI);

            // Get image handle
            //
            var largeImage = document.getElementById('largeImage');

            // Unhide image elements
            //
            largeImage.style.display = 'block';

            // Show the captured photo
            // The inline CSS rules are used to resize the image
            //
            largeImage.src = imageURI;
        },
        // A button will call this function
        //
        capturePhoto: function () {
            // Take picture using device camera and retrieve image as base64-encoded string
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 50 });
        },
        // A button will call this function
        //
        capturePhotoEdit: function () {
            // Take picture using device camera, allow edit, and retrieve image as base64-encoded string  
            navigator.camera.getPicture(onPhotoDataSuccess, onFail, { quality: 20, allowEdit: true });
        },

        // A button will call this function
        //
        getPhoto: function getPhoto(source) {
            // Retrieve image file location from specified source
            navigator.camera.getPicture(onPhotoURISuccess, onFail, {
                quality: 50,
                destinationType: destinationType.FILE_URI,
                sourceType: source
            });
        },

        // Called if something bad happens.
        // 
        onFail: function (message) {
            alert('Failed because: ' + message);
        }
    
    }); 

    app.imageService = {
        initImage: function () {
            app.imageService.viewModel.set(pictureSource,navigator.camera.PictureSourceType);
            app.imageService.viewModel.set(destinationType,navigator.camera.DestinationType);
        },
        viewModel: new imageViewModel()
    };

}
)(window);