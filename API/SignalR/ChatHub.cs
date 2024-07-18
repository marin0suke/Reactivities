using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub // derive from the hub. part of .net runtime.
    {
        private readonly IMediator _mediator;
        public ChatHub(IMediator mediator) // generate ctor from ChatHub.
        {
            _mediator = mediator;
        }

        public async Task SendComment(Create.Command command) // method to send a comment. the name here is important bc the client will be able to invoke methods from this hub.
        {
            var comment = await _mediator.Send(command); // the properties inside the Create will be sent up from the client. the activity id and the comment. everything else, we can get from our logic in the application layer.

            await Clients.Group(command.ActivityId.ToString()) // activityid is a guid so need to turn to string to make it a group name.
                .SendAsync("ReceiveComment", comment.Value); // ned to use this name on client side. also we grab the Value bc the comment is result object that contains a Dto.
        }

        public override async Task OnConnectedAsync() // when client connects to hub we want them to join a group.
        {
            var httpContext = Context.GetHttpContext(); // will get the activity id from the query string. we dont have route parameters when we go to signalr hub.
            var activityId = httpContext.Request.Query["activityId"]; //  grabs the activityid from client.
            await Groups.AddToGroupAsync(Context.ConnectionId, activityId); // join client to the group with the matching activityid.
            var result = await _mediator.Send(new List.Query{ActivityId = Guid.Parse(activityId)}); // we want to send down the list of comments to the client. that we get from the db. 
            await Clients.Caller.SendAsync("LoadComments", result.Value); 
        }
        // we don't need to disconnect. signalR will disconnect any connection ids from any groups.
    }
}