(function(global) {
	var FileViewModel,
		app = global.app = global.app || {};

	FileViewModel = kendo.data.ObservableObject.extend({
		jobId: null,
		onFileSystemSuccess: function(FileSystem) {
			var that = app.fileService.viewModel;

			gFileSystem = FileSystem;
			////console.log("FileSystem.name : " + gFileSystem.name);
		},
		onFileSystemError: function(e) {
			setTimeout(function() {
				var msg = '';
				switch (e.code) {
					case FileError.QUOTA_EXCEEDED_ERR:
						msg = 'QUOTA_EXCEEDED_ERR';
						break;
					case FileError.NOT_FOUND_ERR:
						msg = 'NOT_FOUND_ERR';
						break;
					case FileError.SECURITY_ERR:
						msg = 'SECURITY_ERR';
						break;
					case FileError.INVALID_MODIFICATION_ERR:
						msg = 'INVALID_MODIFICATION_ERR';
						break;
					case FileError.INVALID_STATE_ERR:
						msg = 'INVALID_STATE_ERR';
						break;
					default:
						msg = e.code;
						break;
				};
				////console.log('Error: ' + msg);
				app.jobService.viewModel.hideLoading();
			}, 0);
		},
		updateCameraImages: function(imageURI) {


			//app.fileService.viewModel.set("gImageURI", imageURI);
			setTimeout(function() {
				////console.log("test1");
			}, 0);
			//app.fileService.viewModel.gotImageURI(imageURI);
			window.resolveLocalFileSystemURL(imageURI, app.fileService.viewModel.gotImageURI, app.fileService.viewModel.onFileSystemError);
			setTimeout(function() {
				////console.log("test2");
			}, 0);
		},

		// pickup the file entry, rename it, and move the file to the app's root directory.
		// on success run the movedImageSuccess() method
		gotImageURI: function(fileEntry) {
			var fileSystem = null;
			
			if (gFileSystem != undefined && gFileSystem != null) {
				 fileSystem = gFileSystem;
			}
			
			var jobId = app.fileService.viewModel.get("jobId");

			setTimeout(function() {
				////console.log("fullPath" + fileEntry.fullPath);
				////console.log("name" + fileEntry.name);
				////console.log("file system" + fileSystem.name);
				////console.log("root" + fileSystem.root.name);
				//////console.log(fileEntry.fullPath);
				////console.log("test3");

			}, 0);

			var newName = moment().unix() + ".jpeg";

			fileSystem.root.getDirectory("TTSM/" + jobId, {
				create: true,
				exclusive: false
			}, function(entry) {

				fileEntry.moveTo(entry, newName, app.fileService.viewModel.movedImageSuccess, app.fileService.viewModel.onFileSystemError);
			}, app.fileService.viewModel.onFileSystemError);
		},

		// send the full URI of the moved image to the updateImageSrc() method which does some DOM manipulation
		movedImageSuccess: function(fileEntry) {


			//updateImageSrc(fileEntry.fullPath);
			setTimeout(function() {
				////console.log("move success! : " + fileEntry.fullPath);
				app.jobService.viewModel.listFile();
			}, 0);
		},

		// get a new file entry for the moved image when the user hits the delete button
		// pass the file entry to removeFile()
		removeDeletedImage: function(imageURI) {
			window.resolveLocalFileSystemURL(imageURI, app.fileService.viewModel.removeFile, app.fileService.viewModel.onFileSystemError);

		},
		// delete the file
		removeFile: function(fileEntry) {
			fileEntry.remove();
		},
		removeRecursively: function(entry){
			entry.removeRecursively(function(){
				////console.log("Delete");
			}, app.fileService.viewModel.onFileSystemError);
		}
	});


	app.fileService = {
		viewModel: new FileViewModel()
	};
})(window);
