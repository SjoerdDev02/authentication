import { AxiosHeaders } from "axios";

export type MailpitResponseMessage = {
  ID: string,
  MessageID: string,
  Read: boolean,
  From: { Name: string, Address: string },
  To: [ { Name: string, Address: string } ],
  Cc: string[],
  Bcc: string[],
  ReplyTo: [ { Name: string, Address: string } ],
  Subject: string,
  Created: string,
  Tags: string[],
  Size: number,
  Attachments: number,
  Snippet: string
};

export type MailpitResponse =  {
    status: number,
    statusText: string,
    headers: AxiosHeaders,
    data: {
      total: number,
      unread: number,
      count: number,
      messages_count: number,
      start: number,
      tags: string[],
      messages: MailpitResponseMessage[]
    }
}