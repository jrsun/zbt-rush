Posts = new Meteor.Collection('posts');

Posts.allow({
  update: ownsDocument,
  remove: ownsDocument
});

Posts.deny({
  update: function(userId, post, fieldNames){
    return (_.without(fieldNames, 'url', 'title').length > 0);
  }
});

Meteor.methods({
  post: function(postAttributes){
    var user = Meteor.user();
    var postWithSameLink = Posts.findOne({url: postAttributes.url});

    if(!user)
      throw new Meteor.Error(401, "You need to login!");

    if (!postAttributes.title)
      throw new Meteor.Error(422, 'Please fill in title!');

    if (postAttributes.url && postWithSameLink){
      throw new Meteor.Error(302,
        'This link has been used already',
         postWithSameLink._id);
    }

    var post = _.extend(_.pick(postAttributes, 'url', 'message'), {
      title: postAttributes.title + (this.isSimulation ? '(client)':'(server)'),
      userId: user._id,
      author: user.username,
      submitted: new Date().getTime()
    });

    if (! this.isSimulation){
      var Future = Npm.require('fibers/future');
      var future = new Future();
      Meteor.setTimeout(function(){
        future.return();
      }, 5*1000);
      future.wait();
    }
    var postId = Posts.insert(post);

    return postId;
  }
});