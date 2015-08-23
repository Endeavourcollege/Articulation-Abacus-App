angular.module('starter.controllers', [])

.factory("Auth", function($firebaseAuth) {
  var usersRef = new Firebase("https://popping-heat-7126.firebaseio.com/users");
  return $firebaseAuth(usersRef);
})

.controller('AppCtrl', function($scope, $ionicModal, $timeout, Auth) {
  console.log('AppCtrl');
  
  //on successfull auth add user 
  Auth.$onAuth(function(authData) {
	  console.log('On Auth!');
	  $scope.authData = authData;
	  
	  if (authData === null) {
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
		
	    $scope.displayName = getName(authData); // This will display the user's name in our view
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

.controller("loginCtrl", function($scope, $ionicLoading, $rootScope, $firebase, Auth) {
  console.log('loginCtrl');
  var isNewUser = true; //if new user add details
  
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
  
  //user login
  $scope.fireloginuser = function() {
  	console.log('Email Login');
    Auth.$authWithPassword({
	  email    : $scope.user.username,
	  password : $scope.user.password
	}, function(error, authData) {
		console.log('Spicey Life!');
	  if (error) {
	    console.log("Login Failed!", error);
	  } else {
	    console.log("Authenticated successfully with payload:", authData);
	  }
	});
	
  };
  
})

.controller("createaccountCtrl", function($scope, $rootScope, $firebase, $location, Auth) {

  //user create
  $scope.createuser = function() {
  	
  	var ref = new Firebase("https://popping-heat-7126.firebaseio.com");
	  ref.createUser({
		  email    : $scope.create.username,
		  password : $scope.create.password
	  }, function(error, userData) {
		  if (error) {
			alert(error);
		  } else {
		    console.log("Successfully created user account with uid:", userData.uid);
		    alert("Account Created Successfully");
		    Auth.$authWithPassword({
			  email    : $scope.create.username,
			  password : $scope.create.password
			}, function(error, authData) {
				console.log('Spicey Life!');
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			  }
			});
		  }
	  });
	
  };
  
})

.controller("abacusCtrl", function($scope, $ionicLoading, $http, $q, $ionicPopover) {
  console.log('abacusCtrl');
  	
  	/* Loading abacus svg */
    $scope.loading = true;
	
	$scope.abacusLoader = function() {

		var s = Snap("#abacus_loading");
		
		Snap.load("/svg/abacus.svg", function (f) {
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
		    // Note that we traverse and change attr before SVG
		    // is even added to the page
		    /*f.select("polygon[fill='#09B39C']").attr({fill: "#bada55"});
		    g = f.select("g");
		    s.append(g);
		    // Making croc draggable. Go ahead drag it around!
		    g.drag();
		    // Obviously drag could take event handlers too
		    // Looks like our croc is made from more than one polygon...
		    */
		});
    };
	/* End loading abacus svg */
	
  $scope.abacus = {};
  $scope.abacus.providers = {};
  $scope.abacus.courses = {};
  $scope.abacus.subjects = {};
  $scope.abacus.ecnhcourses = {};
  $scope.pie = {};
  
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
	    $ionicLoading.hide();
	    
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
	    $ionicLoading.hide();
	  });  
  
  //when all data gathered hide loader
  $q.all([getTrainers, getECNHCourses]).then(function(data){
		//console.log(data[0], data[1]);
		//$ionicLoading.hide();
		$scope.loading = false;
  });
  
  //if course is not completed get all subjects
  $scope.abacusCourseSubjects = function() {
	  	
	  	if($scope.abacus.courseComplete != false){
		  return;	
	  	}
	  	
		$ionicLoading.show({
		  template: '<span id="abacus_loading"></span>Getting Subjects...'
		});
	  
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
			  $ionicLoading.hide();
			}).
			error(function(data, status, headers, config) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  alert('There was an error:' + error);
			  alert('status:' + status);
			  $ionicLoading.hide();
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
  
  // .fromTemplate() method
  /*var template = '<ion-popover-view><ion-header-bar> <h1 class="title">My Popover Title</h1> </ion-header-bar> <ion-content></ion-content></ion-popover-view>';

  $scope.popover = $ionicPopover.fromTemplate(template, {
    scope: $scope
  });*/

  // .fromTemplateUrl() method
  $ionicPopover.fromTemplateUrl('my-popover.html', {
    scope: $scope
  }).then(function(popover) {
    $scope.popover = popover;
  });


  $scope.openPopover = function($event) {
    $scope.popover.show($event);
  };
  $scope.closePopover = function() {
    $scope.popover.hide();
  };
  //Cleanup the popover when we're done with it!
  $scope.$on('$destroy', function() {
    $scope.popover.remove();
  });
  // Execute action on hide popover
  $scope.$on('popover.hidden', function() {
    // Execute action
  });
  // Execute action on remove popover
  $scope.$on('popover.removed', function() {
    // Execute action
  });
  
  //send information to be calculated
  $scope.abacusCalc = function() {
	  
		$ionicLoading.show({
		  template: '<span id="abacus_loading"></span>Calculating...'
		});
	  
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
			  
			  $ionicLoading.hide();
			}).
			error(function(data, status, headers, config) {
			  // called asynchronously if an error occurs
			  // or server returns response with an error status.
			  alert('There was an error:' + error);
			  alert('status:' + status);
			  $ionicLoading.hide();
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
	    var query = ref.orderByChild("timestamp").limitToLast(25);
	    
	    // the $firebaseArray service properly handles database queries as well
	    $scope.filteredMessages = $firebaseArray(query);
	    
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

.controller('abacusHistoryItemCtrl', function($scope, $stateParams, Auth) {
	var currentId = $stateParams.abacusId;

	$scope.shouldShowDelete = true;
	$scope.shouldShowReorder = true;
	$scope.listCanSwipe = false;
	$scope.abacushistory = {};
	
	Auth.$onAuth(function(authData) {
	  console.log('History Auth!');
	  $scope.authData = authData;
	  
	  var ref = new Firebase("https//popping-heat-7126.firebaseio.com/abacus-users/" + authData.uid + "/abacus/" + currentId);
	
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

