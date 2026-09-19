export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface RegisterResponse {
  access_token: string;
  refresh_token: string;
  user: {
    id: string;
    display_name: string;
    email: string;
    avatar: string;
    role: string;
    created_at: string;
    updated_at: string;
  };
}

export interface CreateStoreResponse {
  id: string;
  name: string;
  owner_id: string;
  avatar: string;
  banner: string;
  address: string;
  city: string;
  created_at: string;
  updated_at: string;
}

export interface CreateProductResponse {
  id: string;
  store_id: string;
  name: string;
  description: string;
  price: number;
  created_at: string;
  updated_at: string;
  store: {
    id: string;
    name: string;
    owner_id: string;
    avatar: string;
    banner: string;
    address: string;
    city: string;
  };
  media: [
    {
      id: string;
      media_type: "image" | "video";
      media_url: string;
    },
  ];
}
