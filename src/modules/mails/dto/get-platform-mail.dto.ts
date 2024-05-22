export class GetPlatformMailDTO {
  id: string;
  subject: string;
  sender: {
    name: string;
    address: string;
  };
  isRead: boolean;
  isFlagged: boolean;
  receivedDateTime: string;
}
