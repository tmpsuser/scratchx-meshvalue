(function(ext) {
    // TODO: public repo + documentation + samples
    // GH pages
    $.ajax({

        async:false,

        type:'GET',

        url:'https://cdn.firebase.com/js/client/2.2.4/firebase.js',

        data:null,
        
        success: function(){fb = new Firebase('https://scratchx.firebaseio.com');console.log('FIREBASE OK');}, //Create a firebase reference

        dataType:'script'

    });
    window['temp'] = 0; // init
	window.meshHat = {};
	window.ignoreVal = {};
    // Cleanup function when the extension is unloaded
    ext._shutdown = function() {};

    // Status reporting code
    // Use this to report missing hardware, plugin or unsupported browser
    ext._getStatus = function() {
        return {status: 2, msg: 'Ready'};
    };
	window.recv = {};
	var who = Math.random().toString(36).slice(2);
    ext.broadcast = function(name, val) {
        if (name.length > 0){ // blank broadcasts break firebase - not nice.
			fb.child('broadcasts/' + name).set({value:val,who}); //Change value of broadcast so other clients get an update
        }
    };
    
   ext.mesh_hat = function(name) {
       fb.child('broadcasts/' + name).on('value', function(snap){
		window.recv[name] = snap.val().value;
		window.meshHat[name] = snap.val();
	   });
	   if(meshHat[name].who === who) {
		   delete meshHat[name];
		   return false;
	   }
	   if(meshHat[name]) {
		   delete meshHat[name];
		   return true;
	   } else return false;

   }
   ext.valOf = function(name){
	   return window.recv[name];
   }
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
			['r', 'valueOf %s', 'valOf'],
            [' ', 'mesh broadcast %s with value %s', 'broadcast'],
            ['h', 'when I receive mesh %s', 'mesh_hat']
        ],
        url: 'http://technoboy10.tk/mesh'
    };


    // Register the extension
    ScratchExtensions.register('Mesh', descriptor, ext);
})({});
