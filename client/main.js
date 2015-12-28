



	//Routing

	Router.configure({
	  layoutTemplate: "AppTemp" 
	});

	Router.route('/', function () {
		  this.render('navbar', {
		  to: "navbar"
	  }); 
		   this.render('main-content', {
		  to: "main"
	  }); 
	});

	Router.route('/single/:_id', function () {
		  this.render('navbar', {
		  to: "navbar"
	  }); 
		   this.render('single-w', {
		  to: "main",
		  data: function () {
		  	return Websites.findOne({_id:this.params._id});
		  }
	  }); 

	});

	//Comments

	Comments.ui.config({
   		template: 'bootstrap' // or ionic, semantic-ui
	});

	//Accounts

	Accounts.ui.config({  
  		passwordSignupFields: "USERNAME_AND_EMAIL"  		
	});

	
	/////
	// template helpers 
	/////

	// helper function that returns all available websites
	Template.website_list.helpers({
		
		  websites: function () {
		    var regexp = new RegExp(Session.get('search/keyword'), 'i');
		    return Websites.find({title: regexp}, {sort:{rating:-1}});
		   
		  },
		 


	});

	Template.website_item.helpers({
		getUser:function(user_id){
			var user=Meteor.users.findOne({_id:user_id});
			if (user) {
				return user.username;
			}
			else {
				return "Anon User";
			}
		},
		filtering_images:function(){
		  if (Session.get("userFilter")){// they set a filter!
		    return true;
		  } 
		  else {
		    return false;
		  }
		},
		
	});




	/////
	// template events 

	/////


		Template.search.events({
		  'keyup #search': function(event) {
		    Session.set('search/keyword', event.target.value);
		  }
		});

	
	Template.website_item.events({
		"click .js-upvote":function(event){
			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			// put the code in here to add a vote to a website!
			
			
			
			var website_id = this._id;
			console.log(website_id);
			Websites.update({_id:website_id}, 
               {$inc: {rating:1}});

			


			return false;// prevent the button from reloading the page
		}, 
		"click .js-downvote":function(event){

			// example of how you can access the id for the website in the database
			// (this is the data context for the template)
			
			var website_id = this._id;
			console.log(website_id);
			Websites.update({_id:website_id}, 
               {$inc: {rating:-1}});
			

			// put the code in here to remove a vote from a website!

			return false;// prevent the button from reloading the page
		},
		"click .js-rem-button":function(event){
		
			var website_id = this._id;
			$("#" + website_id).hide("slow", function () {
			Websites.remove({"_id":website_id});
		})
		},
		"click .js-user-filter":function(event){
		
			Session.set("userFilter", this.createdBy);
		},
		"click .js-unset-image-filter":function(event){
		
			Session.set("userFilter", undefined);
		},		
		
		
	
			
	});

	Template.website_form.events({
		"click .js-toggle-website-form":function(event){
			$("#website_form").toggle('slow');
		}, 
		"submit .js-save-website-form":function(event){

			// Get form data
			var url, title, description; 
			url = event.target.url.value;
			title = event.target.title.value;
			description = event.target.description.value;

			
			console.log("The url they entered is: "+url+"title: "+title+"desc: "+description);

			
			//  Save data
			if (Meteor.user()) {
				Websites.insert({

					title:title, 
		    		url:url, 
		    		description:description, 
		    		createdOn:new Date(),
		    		createdBy:Meteor.user()._id,
		    		rating: 0


				});	
			}

			return false;// stop the form submit from reloading the page

		}


	});




