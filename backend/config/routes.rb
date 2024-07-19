Rails.application.routes.draw do
  resources :prescriptions
  resources :stables
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/")

  namespace :api do
    # root "users#signup"
    post 'signup', to: 'users#signup'
    post 'login', to: 'users#login'
    post 'logout', to: 'users#logout'
    # delete 'delete-user', to: 'users#destroy' -- write tests for this to validate

    resources :stables, only: [:index, :show, :create, :update, :destroy]
    resources :prescriptions, only: [:index, :show, :create, :update, :destroy]
  end
end
