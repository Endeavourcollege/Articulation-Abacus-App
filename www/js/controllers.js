angular.module('starter.controllers', [])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://popping-heat-7126.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})

.filter('reverse', function() {
  function toArray(list) {
     var k, out = [];
     if( list ) {
        if( angular.isArray(list) ) {
           out = list;
        }
        else if( typeof(list) === 'object' ) {
           for (k in list) {
              if (list.hasOwnProperty(k)) { out.push(list[k]); }
           }
        }
     }
     return out;
  }
  return function(items) {
     return toArray(items).slice().reverse();
  };
})
   
.controller('AppCtrl', function($scope, $ionicModal, $timeout, $location, Auth) {
  console.log('AppCtrl');
  
  //on successfull auth add user 
  Auth.$onAuth(function(authData) {
	  console.log('On Auth!');
	  $scope.authData = authData;
	  
	  if (authData === null) {
		$location.path('/mainlogin');
	    console.log("Not logged in yet");
	  } else {
	  	setAuthData(authData);
	  }
	  
  });
  
  $scope.firelogout = function() {
	  Auth.$unauth();
  };
  
  function setAuthData(authData) {
	  $scope.authData = authData;
	  
	  if (authData === null) {
	    console.log("Not logged in yet");
	  } else {
	    console.log("Logged in as", authData.uid);
	    console.log(authData);
	    //Items.child("users").child(authData.uid).$add({
		
		var users = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/" + authData.uid);
		
		var usersRef = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/");
		usersRef.child(authData.uid).once('value', function(snapshot) {
		    if(snapshot.val() == null){
			 	users.set({
			      provider: authData.provider,
			      firstname: getName(authData),
			      lastname: '',
			      country: '',
			      email: getEmail(authData),
			      phone: '',
			      country: '',
			      state: '',
			      postcode: ''
			    });   
		    }
		});
		
	    $scope.displayName = getName(authData); // Get user's name
	  }
  }
  
  //get name depending on auth type
  function getName(authData) {
	  switch(authData.provider) {
	     case 'password':
	       return authData.password.email.replace(/@.*/, '');
	     case 'facebook':
	       return authData.facebook.displayName;
	  }
  }
  
  //get name depending on auth type
  function getEmail(authData) {
	  switch(authData.provider) {
	     case 'password':
	       return authData.password.email;
	     case 'facebook':
	       return authData.facebook.email;
	  }
  }
  
})

.controller("loginCtrl", function($scope, $location, $ionicModal, $ionicLoading, $rootScope, $firebase, Auth) {
  console.log('loginCtrl');
  Auth.$onAuth(function(authData) {
	  if (authData === null) {
	    console.log("Need to login!");
	  } else {
		$location.path('/app/abacus');
	  }
  });
  
  // Login Modal
  $ionicModal.fromTemplateUrl('my-modal.html', {
    scope: $scope,
    animation: 'slide-in-up'
  }).then(function(modal) {
    $scope.modal = modal;
  });
  $scope.openModal = function() {
    $scope.modal.show();
  };
  $scope.closeModal = function() {
    $scope.modal.hide();
  };
  //Cleanup the modal when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.modal.remove();
  });
  // Execute action on hide modal
  $scope.$on('modal.hidden', function() {
    // Execute action
  });
  // Execute action on remove modal
  $scope.$on('modal.removed', function() {
    // Execute action
  });
  
  console.log(Auth);
  //facebook login
  
  if (sessionStorage.reload) {
	    delete sessionStorage.reload;
		$ionicLoading.show({
		  template: 'Logging In Facebook...'
		});
	    setTimeout(function() {
	        location.reload();
	    }, 1500)
  }
  
  $scope.fireloginfacebook = function() {
	sessionStorage.reload = true; // set to reload page once logged in with facebook
	console.log('Facebook Login');
    Auth.$authWithOAuthRedirect("facebook", {scope: "email"}).then(function(authData) {
      // User successfully logged in
    }).catch(function(error) {
      if (error.code === "TRANSPORT_UNAVAILABLE") {
        Auth.$authWithOAuthPopup("facebook", {scope: "email"}).then(function(authData) {
          // User successfully logged in. We can log to the console
          // since we’re using a popup here
          console.log(authData);
        });
      } else {
        // Another error occurred
        console.log(error);
      }
    });
  };
  
  //email user login
  $scope.user = {};
  $scope.user.create = false;
  $scope.user.forgot = false;
  
  $scope.fireloginuser = function() {
  	console.log('Email Login');
    Auth.$authWithPassword({
	  email    : $scope.user.username,
	  password : $scope.user.password
	}).then(function(authData) {
	  console.log("Logged in as:", authData.uid);
	  $scope.modal.hide();
	}).catch(function(error) {
	  console.error("Authentication failed:", error);
	  alert('Username or Password is incorrect');
	});
  };
  
  $scope.createuserBtn = function() {
  	console.log('create user');
  	$scope.user.create = true;
  }
  
  $scope.forgotuserBtn = function() {
  	console.log('forgot user');
  	$scope.user.forgot = true;
  }
  
  $scope.canceluserBtn = function() {
  	console.log('cancel user');
  	$scope.user.create = false;
  	$scope.user.forgot = false;
  }
  
  //user create
  $scope.firecreateuser = function() {
	   	console.log('Email Create');
	 Auth.$createUser({
		  email: $scope.user.username,
		  password : $scope.user.password
	  }).then(function(authData) {
		  console.log("User " + authData.uid + " created successfully!");
		  
		  var users = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/" + authData.uid);
		
		  var usersRef = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/");
		  usersRef.child(authData.uid).once('value', function(snapshot) {
		    if(snapshot.val() == null){
			 	users.set({
			      provider: 'password',
			      firstname: $scope.user.firstname,
			      lastname: $scope.user.lastname,
			      country: $scope.user.country,
			      email: $scope.user.username,
			      phone: $scope.user.phone,
			      country: $scope.user.country,
			      state: $scope.user.state,
			      postcode: $scope.user.postcode
			    });   
		    }
		  });
		  
		  return Auth.$authWithPassword({
		    email: $scope.user.username,
			password : $scope.user.password
		  });
		  
	  }).then(function(authData) {
		  console.log("Logged in as:", authData.uid);
		  $scope.modal.hide();
	  }).catch(function(error) {
		  console.error("Error: ", error);
		  alert('Error Creating Account!');
	  });
	
  };
  
  //user forgot email
  $scope.fireforgotuser = function() {
  	console.log('Email Password');
	Auth.$resetPassword({
	  email: $scope.user.username
	}).then(function() {
	  alert("Password reset email sent successfully!");
	}).catch(function(error) {
	  console.error("Error: ", error);
	  alert("Error: ", error);
	});
  };
  
})

.controller("demoCtrl", function($scope, $state, $ionicSlideBoxDelegate) {
  console.log('Demo Reel!');
})

.controller("abacusAccount", function($scope, $ionicModal, $rootScope, $firebase, $location, $firebaseObject, Auth) {
	Auth.$onAuth(function(authData) {
	  console.log('Account Auth!');
	  if (authData === null) {
	    console.log("Not logged in yet");
	  }
	  $scope.authData = authData;
	  
	  var ref = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/" + authData.uid);
	  var profile = $firebaseObject(ref);
	  
	  profile.$bindTo($scope, "profile");
	});
	
	// Login Modal
	  $ionicModal.fromTemplateUrl('my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	  $scope.openModal = function() {
	    $scope.modal.show();
	  };
	  $scope.closeModal = function() {
	    $scope.modal.hide();
	  };
	  //Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  });
	  
	  //user change password
	  $scope.account = {};
	  $scope.firechangepass = function() {
	  	console.log('Change Password');
	  	if($scope.account.oldpassword == '' || $scope.account.newpassword == '') {
		  	alert('Please Enter Passwords');
	  	}
		Auth.$changePassword({
		  email: $scope.profile.email,
		  oldPassword: $scope.account.oldpassword,
		  newPassword: $scope.account.newpassword
		}).then(function() {
		  alert("Password reset successfully!");
		  $scope.modal.hide();
		}).catch(function(error) {
		  console.error("Error: ", error);
		  alert(error);
		});
	  };
  
})

.controller("abacusCtrl", function($scope, $ionicLoading, $http, $q, $ionicPopover) {
  console.log('abacusCtrl');
  	
  	/* Loading abacus svg */
    $scope.loading = {};
    $scope.loading.display = true;
    $scope.loading.text = 'Gathering Data';
	
	$scope.abacusLoader = function() {

		var s = Snap("#abacus_loading");
		
		Snap.load("svg/abacus.svg", function (f) {
			console.log(f);
			console.log(s);
			s.append(f);
			
			timer = 300;         // this is the length of how long it takes for the bead to move
			bDeloy = 30;         // this is the time inbetween the beads moving,
			bMoveDis = 'T70,0';  // absolute transform (x,y) units
		
			// all the parts
			abaFrame = s.select('#abacus');
			balls =
			[
				s.select('#ball11'),s.select('#ball12'),s.select('#ball13'),
				s.select('#ball21'),s.select('#ball22'),s.select('#ball23'),
				s.select('#ball31'),s.select('#ball32'),s.select('#ball33')
			];
			
			  //Managing the row
			  ballCount = [0,0,0];
				
				// --- main loop
			
				setInterval(function () {CheckPos(0)}, timer+bDeloy);
				
				// assigns the values to each row
			  function CheckPos()
			  {
			    // for row 3 step Sequence
			    if(ballCount[2] ==5)
			    {
			      ballCount[2]=0;
			    }
			
			    //for row 2 step Sequence
			    if(ballCount[1] > 3)
			    {
			      ballCount[1]++;
			
			      if(ballCount[1] == 5)
			      {
			          ballCount[2]++;
			          ballCount[1]=0;
			      }
			    }
			
			    // for row 1 step Sequence
			    ballCount[0]++;
			    if(ballCount[0] == 5)
			    {
			      ballCount[0]=0;
			      ballCount[1]++;
			    }
			
			    // Moves Rows
			    MoveBall(0);
			    MoveBall(1);
			    MoveBall(2);
			  }
			
			  // the movement states of the balls on a row, row is an int of the row called
			function MoveBall(row)
			{
				rowCheck = row*3;
				switch (ballCount[row])
				{
					case 1:
						balls[2+rowCheck].animate({transform: bMoveDis}, timer, mina.easeout);
						break;
					
					case 2:
					   balls[1+rowCheck].animate({transform: bMoveDis}, timer, mina.easeout);
					  break;
					
					case 3:
					   balls[0+rowCheck].animate({transform: bMoveDis}, timer, mina.easeout);
					   break;
					
					case 4:
					  balls[0+rowCheck].animate({transform:'T0,0'}, timer, mina.easeout);
				    balls[1+rowCheck].animate({transform:'T0,0'}, timer, mina.easeout);
					  balls[2+rowCheck].animate({transform:'T0,0'}, timer, mina.easeout);
					  break;
		
					default:
				    break;
				};
			}
		});
    };
	/* End loading abacus svg */
	
  $scope.abacus = {};
  $scope.abacus.providers = {};
  $scope.abacus.courses = {};
  $scope.abacus.subjects = {};
  $scope.abacus.ecnhcourses = {};
  $scope.pie = {};
  $scope.abacus.courseComplete = true; 
  $scope.abacus.notCombined = true;
  
  //style the pie graph
  $scope.pie.pie_percentage = 0;
  $scope.pie.pie_guage_data = [
  	{label: "Completed*", value: $scope.pie.pie_percentage, suffix: "%", color: "steelblue"}
  ];
  $scope.pie.pie_options = {thickness: 10, mode: "gauge", total: 100};
  
  $scope.pie.pie_percentage = 10;
  
  //call to get initial providers
  console.log('getting data!');
  
  var getTrainers = $http.get('http://appservices.endeavour.edu.au/abacus_api/abacus_trainer.php').
	  success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available
	    console.log(data);
	    $scope.abacus.providers = data.provider;
	    $scope.abacus.courses = data.courses;
	  }).
	  error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    console.log('There was an error:' + JSON.stringify(config));
	    console.log('status:' + status);
	    $scope.loading.display = false;
		$scope.loading.text = '';
	    
	  });
  
  var getECNHCourses = $http.get('http://appservices.endeavour.edu.au/abacus_api/abacus_ecnh_courses.php').
	  success(function(data, status, headers, config) {
	    // this callback will be called asynchronously
	    // when the response is available
	    console.log(data);
	    $scope.abacus.ecnhcourses = data.courseECNH;
	  }).
	  error(function(data, status, headers, config) {
	    // called asynchronously if an error occurs
	    // or server returns response with an error status.
	    console.log(data);
	    $scope.loading.display = false;
		$scope.loading.text = '';
	  });  
  
  //when all data gathered hide loader
  $q.all([getTrainers, getECNHCourses]).then(function(data){
		//console.log(data[0], data[1]);
		//$ionicLoading.hide();
		$scope.loading.display = false;
		$scope.loading.text = '';
  });
  
  //check if there is a combined qual in dropdown if true automatically show subjects
  $scope.checkQuals = function() {
	  cleanSubjects();
	  
	  if($scope.abacus.courses[$scope.abacus.provider][0] == 'Combined Qualifications') {
		  console.log('Combined!');
		  $scope.abacus.course = 'Combined Qualifications';
		  $scope.abacus.courseComplete = false;
		  $scope.abacus.notCombined = false;
		  $scope.abacusCourseSubjects();
	  }
  };
  
  //if course is not completed get all subjects
  $scope.abacusCourseSubjects = function() {
	  	
	  	if($scope.abacus.courseComplete != false){
		  return;	
	  	}
	  	
	  	$scope.abacus.subjects = {};
	  	$scope.loading.display = true;
		$scope.loading.text = 'Getting Subjects';
	  
		console.log('Getting Courses');
		console.log('Provider: ' + $scope.abacus.provider);
		console.log('Course: ' + $scope.abacus.course);  
		
		var dataSend = {
			trainingProvider: $scope.abacus.provider,
			trainingCourse: $scope.abacus.course
		};
		
		$http.post('http://appservices.endeavour.edu.au/abacus_api/abacus_trainer_course_subjects.php', dataSend).
			success(function(data, status, headers, config) {
			  $scope.abacus.subjects = data.subjects;
			  console.log(data);
			  $scope.loading.display = false;
			  $scope.loading.text = '';
			}).
			error(function(data, status, headers, config) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  alert('There was an error:' + error);
			  alert('status:' + status);
			  $scope.loading.display = false;
			  $scope.loading.text = '';
			});
  };
  
  //get all subjects checkboxes and turn them into array to send to calc
  $scope.abacus.subjectsComplete = [];
  // toggle selection of subjects for array
  $scope.toggleSelection = function toggleSelection(subject) {
     var idx = $scope.abacus.subjectsComplete.indexOf(subject);

     // is currently selected
     if (idx > -1) {
       $scope.abacus.subjectsComplete.splice(idx, 1);
     }

     // is newly selected
     else {
       $scope.abacus.subjectsComplete.push(subject);
     }
   };
  
  //remove all subjects from subjects selection
  function cleanSubjects() {
	  $scope.abacus.notCombined = true;
	  $scope.abacus.subjects = {};
	  $scope.abacus.courseComplete = true;
  };
  
  //send information to be calculated
  $scope.abacusCalc = function() {
		$scope.loading.display = true;
		$scope.loading.text = 'Calculating';
		
		console.log('Calculating');
		console.log('Provider: ' + $scope.abacus.provider);
		console.log('Course: ' + $scope.abacus.course);
		console.log('ECNH: ' + $scope.abacus.ecnhcourse);  
		
		var dataSend = {
			trainingProvider: $scope.abacus.provider,
			courseCompleted: $scope.abacus.course,
			courseCompletedFull: $scope.abacus.courseComplete,
			courseSubjects: $scope.abacus.subjectsComplete,
			qualificationEcnh: $scope.abacus.ecnhcourse
		};
		
		$http.post('http://appservices.endeavour.edu.au/abacus_api/abacus_calc.php', dataSend).
			success(function(data, status, headers, config) {
			  // this callback will be called asynchronously
			  // when the response is available
			  console.log(data);
			  $scope.pie.pie_percentage = data.coursePC;
			  $scope.pie.pie_guage_data = [
			  	{label: "Completed*", value: $scope.pie.pie_percentage, suffix: "%", color: "steelblue"}
			  ];
			  $scope.abacus.results = data;
			  try {
					var storage = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/" + $scope.authData.uid);
			  
				  storage.child('abacus').push({
				    training_provider: data.dataSent.trainingProvider,
				    trainer_course: data.dataSent.courseCompleted,
				    endeavour_course_code: data.dataSent.qualificationEcnh,
				    endeavour_course: data.courseName,
				    course_credits: data.courseCP,
				    course_required: data.courseNP,
				    percentage: data.coursePC,
				    display: 1
			      });  
			  }catch(e){
				  console.log(e);
			  }
			  
			  //$ionicLoading.hide();
			  $scope.loading.display = false;
			  $scope.loading.text = '';
			}).
			error(function(data, status, headers, config) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  alert('There was an error:' + error);
			  alert('status:' + status);
			  //$ionicLoading.hide();
			  $scope.loading.display = false;
			  $scope.loading.text = '';
			});
  };

})

.controller('abacusHistoryCtrl', function($scope, $firebaseArray, Auth) {
	
	$scope.shouldShowDelete = true;
	$scope.shouldShowReorder = true;
	$scope.listCanSwipe = false;
	$scope.abacushistory = {};
	
	Auth.$onAuth(function(authData) {
	  console.log('On Auth!');
	  $scope.authData = authData;
	  
	  var ref = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/" + authData.uid + "/abacus/");
	  
	   // download the data from a Firebase reference into a (pseudo read-only) array
	    // all server changes are applied in realtime
	    $scope.abacushistory.submits = $firebaseArray(ref);
	    
	    // create a query for the most recent 25 messages on the server
	    //var query = ref.orderByChild("timestamp").limitToLast(25);
	    
	    // the $firebaseArray service properly handles database queries as well
	    //$scope.filteredMessages = $firebaseArray(query);
	    
	  // Attach an asynchronous callback to read the data at our posts reference
	  /*ref.on("value", function(snapshot) {
	    console.log(snapshot.val());
	    $scope.$apply(function () {
	    	$scope.abacushistory.submits = snapshot.val();
	    });
	  }, function (errorObject) {
	    console.log("The read failed: " + errorObject.code);
	  });*/
	  
	  
	  
	  if (authData === null) {
	    console.log("Not logged in yet");
	  } 
	});
	/*var histroy = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/");
	var history = users.$getRecord("simplelogin:1");
	console.log(history);*/
})

.controller('abacusHistoryItemCtrl', function($scope, $location, $stateParams, $ionicPopup, $firebaseObject, Auth) {
	var currentId = $stateParams.abacusId;

	$scope.shouldShowDelete = true;
	$scope.shouldShowReorder = true;
	$scope.listCanSwipe = false;
	$scope.abacushistory = {};
	$scope.authData = {};
	var ref = {};
	
	Auth.$onAuth(function(authData) {
	  console.log('History Auth!');
	  $scope.authData = authData;
	  
	  ref = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/" + authData.uid + "/abacus/" + currentId);
	
	  // Attach an asynchronous callback to read the data at our posts reference
	  ref.on("value", function(snapshot) {
	    console.log(snapshot.val());
	    $scope.$apply(function () {
	    	$scope.abacushistory.item = snapshot.val();
	    });
	  }, function (errorObject) {
	    console.log("The read failed: " + errorObject.code);
	  });
	  
	  if (authData === null) {
	    console.log("Not logged in yet");
	  } 
	});
	
	$scope.removeAbacusItem = function() { 

		var confirmPopup = $ionicPopup.confirm({
		    title: 'Remove Abacus Item',
		    template: 'Are you sure you want to remove this?'
		});
		 
		confirmPopup.then(function(res) {
		    if(res) {
			   var historyItemDisplay = $firebaseObject(ref.child('display'));			   
			   historyItemDisplay.$value = 0;
			   historyItemDisplay.$save();
			   $location.path('/app/abacushistory');
		    } else {
		       console.log('You are not sure');
		    }
		});

	};
	
	$scope.enquireAbacusItem = function() { 
		//show form of all user data allowing them to make changes
		//submit to leads api
	};
	
})

.controller('svg', function($scope, $stateParams) {

	//controls area size
	//var s = Snap(200,200);
	/*var s = Snap('#animate');
	var timer;
	
	//draw shadow
	var shadow = s.ellipse(100, 175, 30, 10);
	shadow.attr({
		fill: "#2c3e50",
	});
	
	//draw circle
	var bigCircle = s.ellipse(100, 120, 50, 50);
	bigCircle.attr({
		fill: "#fff",
	});
	
	function ShadowRx(){
		shadow.animate({rx: 10}, 1000, mina.elastic, function(){shadow.animate({rx: 30}, 700, mina.bounce);
		});
	};
	
	function ShadowRy(){
		shadow.animate({ry: 3}, 1000, mina.elastic, function(){shadow.animate({ry: 10}, 700, mina.bounce);
		});
	};
	
	function BallRx(){
		bigCircle.animate({rx: 40}, 1000, mina.elastic, function(){bigCircle.animate({rx: 80}, 700, mina.bounce);
		});
	};
	
	function BallRy(){
		bigCircle.animate({ry: 50}, 1000, mina.elastic, function(){bigCircle.animate({ry: 30}, 700, mina.bounce);
		});
	};
	
	function BallY(){
		bigCircle.animate({transform:'T0,-30'}, 1000, mina.elastic, function(){bigCircle.animate({transform:'T0,20'}, 700, mina.bounce);
		});
	};
	
	setInterval(ShadowRx, 1700);
	setInterval(ShadowRy, 1700);
	setInterval(BallRx, 1700);
	setInterval(BallRy, 1700);
	setInterval(BallY, 1700);*/
	
	var s = Snap("#abacus_loading");
		
	Snap.load("../svg/abacus.svg", function (f) {
		//f is the abacus
		//s is the div to load the svg to
		s.append(f);

		timer = 300;         // this is the length of how long it takes for the bead to move
		bDeloy = 30;         // this is the time inbetween the beads moving,
		bMoveDis = 'T70,0';  // absolute transform (x,y) units
	
	  // all the parts
		abaFrame = s.select('#abacus');
		balls =
		[
			s.select('#ball11'),s.select('#ball12'),s.select('#ball13'),
			s.select('#ball21'),s.select('#ball22'),s.select('#ball23'),
			s.select('#ball31'),s.select('#ball32'),s.select('#ball33')
		];
		
	  //Managing the row
	  ballCount = [0,0,0];
		
		// --- main loop
	
		setInterval(function () {CheckPos(0)}, timer+bDeloy);
		
		// assigns the values to each row
	  function CheckPos()
	  {
	    // for row 3 step Sequence
	    if(ballCount[2] ==5)
	    {
	      ballCount[2]=0;
	    }
	
	    //for row 2 step Sequence
	    if(ballCount[1] > 3)
	    {
	      ballCount[1]++;
	
	      if(ballCount[1] == 5)
	      {
	          ballCount[2]++;
	          ballCount[1]=0;
	      }
	    }
	
	    // for row 1 step Sequence
	    ballCount[0]++;
	    if(ballCount[0] == 5)
	    {
	      ballCount[0]=0;
	      ballCount[1]++;
	    }
	
	    // Moves Rows
	    MoveBall(0);
	    MoveBall(1);
	    MoveBall(2);
	  }
	
	  // the movement states of the balls on a row, row is an int of the row called
		function MoveBall(row)
		{
			rowCheck = row*3;
			switch (ballCount[row])
			{
				case 1:
					balls[2+rowCheck].animate({transform: bMoveDis}, timer, mina.easeout);
					break;
				
				case 2:
				   balls[1+rowCheck].animate({transform: bMoveDis}, timer, mina.easeout);
				  break;
				
				case 3:
				   balls[0+rowCheck].animate({transform: bMoveDis}, timer, mina.easeout);
				   break;
				
				case 4:
				  balls[0+rowCheck].animate({transform:'T0,0'}, timer, mina.easeout);
			      balls[1+rowCheck].animate({transform:'T0,0'}, timer, mina.easeout);
				  balls[2+rowCheck].animate({transform:'T0,0'}, timer, mina.easeout);
				  break;
	
				default:
			    break;
			};
		}
		
	});


});

