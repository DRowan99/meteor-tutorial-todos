import { Meteor } from 'meteor/meteor';
import { Template } from 'meteor/templating';
import { ReactiveDict } from 'meteor/reactive-dict';
import { Tasks } from '../api/tasks.js'
import './task.html';

import './task.js';
import './body.html';

Template.body.onCreated(function(){
	this.state = new ReactiveDict();
});
 
Template.body.helpers({
  tasks(){
  	const instance = Template.instance();
  	if (instance.state.get('hideCompleted')) {
  		// If hide-completed is checked, filter tasks
  		return Tasks.find({ checked: { $ne: true } }, { sort: { createdAt: -1 } });
  	}
  	// Otherwise return all of the tasks
  	return Tasks.find({}, {sort: { createdAt: -1 } });
  },
  incompleteCount(){
  	return Tasks.find({ checked: { $ne: true } }).count();
  },
  movies: [
  	{name: 'Die Hard', rating: 5, tags: ['Action','Christmas']},
  	{name: 'Christmas with The Kranks', rating: 4, tags: ['Comedy','Holiday','Christmas']},
  	{name: 'Polar Express', rating: 3.5, tags: ['Christmas','Family','Action']}
  ]
});

Template.body.events({
	'submit .new-task'(event) {
		event.preventDefault(); // Don't submit the form
		const target = event.target;
		const text = target.text.value;

		Tasks.insert({
			text, 
			createdAt: new Date()//,
			//owner: Meteor.userId(),
			//username: Meteor.user().username
		});
		target.text.value = "";
	},
	'change .hide-completed input'(event, instance) {
		instance.state.set('hideCompleted', event.target.checked);
	}
})