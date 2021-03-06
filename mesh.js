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
	window.msgForm = {};
	var whoAmI = Math.random().toString(36).slice(2);
	console.log("RMSH:",whoAmI);
    ext.emit_msg = function(name) {
        if (name.length > 0 && name && msgForm[name]){ // blank broadcasts break firebase - not nice.
			fb.child('broadcasts/' + name).set({who: whoAmI, data: msgForm[name]}); //Change value of broadcast so other clients get an update
			delete msgForm[name];
        }
    };
   ext.create_message = function(name){
	   if(name.length > 0) window.msgForm[name]={};
   }
   ext.msg_set_object = function(keyName, messageName, value){
	   window.msgForm[messageName][keyName]=value;
   }
   ext.mesh_hat = function(name) {
       fb.child('broadcasts/' + name).on('value', function(snap){
		window.recv[name] = snap.val();
		window.meshHat[name] = snap.val();
		console.log("Snap!",name,snap.val());
	   });
	   if(meshHat[name].who === whoAmI) {
		   delete meshHat[name];
		   delete recv[name];
		   return false;
	   }
	   if(meshHat[name]) {
		   delete meshHat[name];
		   return true;
	   } else return false;

   }
   ext.valOf = function(key, name){
	   if(!(key && recv[name] && recv[name][key])) return;
	   return window.recv[name][key];
   }
    // Block and block menu descriptions
    var descriptor = {
        blocks: [
			['r', 'Key %s of message %s', 'valOf'],
			[' ', 'Create new message with name %s', 'create_message'],
			[' ', "Set key %s of message %s to %s", "msg_set_object"],
			[" ", "Emit message %s", "emit_msg"],
            ['h', 'when I receive mesh %s', 'mesh_hat']
        ],
        url: 'http://technoboy10.tk/mesh'
    };


    // Register the extension
    ScratchExtensions.register('Mesh', descriptor, ext);
})({});
