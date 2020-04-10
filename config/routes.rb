Rails.application.routes.draw do
  root 'pages#app'
  resources :price_records, only: %i[index create]
  get 'sw.js' => 'service_worker#service_worker'
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
