Rails.application.routes.draw do
  root 'pages#app'
  get 'manifest' => 'manifest#manifest', constraints: { format: 'webmanifest' }
  scope controller: 'pages' do
    get 'about'
    get 'help'
  end
  resources :price_records, only: %i[index create] do
    collection do
      patch 'update_timezone'
    end
  end
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
end
