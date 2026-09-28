export type Paper = {
  id: string;
  title: string;
  creator_name: string;
  is_closed: boolean;
  created_at: string;
};

export type Message = {
  id: string;
  author: string;
  content: string;
  color: string;
  created_at: string;
};
