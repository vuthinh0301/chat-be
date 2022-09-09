export class MessageCreateEvent {
  conversation: string;
  last_message: string;

  constructor(conversation: string, last_message: string) {
    this.conversation = conversation;
    this.last_message = last_message;
  }
}
