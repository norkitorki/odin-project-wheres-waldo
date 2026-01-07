Rails.application.routes.draw do
  root "home#index"

  resources :maps, only: :show
  resources :users, only: :create
  resources :authentications, only: %i[ create ]

  get "scoreboard/:map_id" => "scoreboards#show", as: "scoreboard"
  get "user" => "users#show", as: "user"
  delete "authentications" => "authentications#destroy"
  delete "user" => "users#destroy"

  defaults format: :json do
    resources :scores, only: %i[ index create ]

    get "findable" => "findables#show"

    get "score" => "scores#show"
    post "game_sessions/:map_id" => "game_sessions#create"
    delete "score" => "scores#destroy"
    delete "game_sessions" => "game_sessions#destroy"
  end
end
