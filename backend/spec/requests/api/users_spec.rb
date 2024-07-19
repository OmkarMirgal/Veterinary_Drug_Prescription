require 'rails_helper'

RSpec.describe "Api::Users", type: :request do
  describe 'POST /api/signup' do
    let(:valid_attributes) { attributes_for(:user) }

    context 'when the request is valid' do
      it 'creates a new user' do
        expect {
          post '/api/signup', params: { user: valid_attributes }
        }.to change(User, :count).by(1)
        expect(response).to have_http_status(:created)
        expect(JSON.parse(response.body)).to include('message' => 'User created successfully')
      end
    end

    context 'when the request is invalid' do
      it 'returns status code 422' do
        post '/api/signup', params: { user: { email: 'invalid-email' } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include('errors')
      end
    end
  end

  describe 'POST /api/login' do
    let!(:user) { create(:user, password: 'password', password_confirmation: 'password') }

    context 'when the credentials are valid' do
      it 'authenticates the user and returns a token' do
        post "/api/login", params: { user: {email: user.email, password:"password"} }

        expect(response).to have_http_status(:ok)
        
        response_body = JSON.parse(response.body)
        expect(response.headers['Authorization']).to be_present
        expect(response.headers['Authorization']).to eq(response_body['token'])
        expect(response_body).to include("message" => "Logged in successfully")

      end
    end

    context 'when the credentials are invalid' do
      it 'returns status code 401' do
        post '/api/login', params: { user: { email: 'wrong@gmail.com', password: ' wrong password' } }

        expect(response).to have_http_status(:unauthorized)
        expect(JSON.parse(response.body)).to include('error')
        expect(response.headers['Authorization']).not_to be_present
      end
    end

    context 'when email is missing' do
      it 'returns status code 422' do
        post '/api/login', params: { user: { password: 'password' } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include('error' => 'Email is required')
      end
    end

    context 'when password is missing' do
      it 'returns status code 422' do
        post '/api/login', params: { user: { email: 'test@gmail.com' } }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include('error' => 'Password is required')
      end
    end
    
    context 'when params does not have a nested structure where user is key' do
      it 'returns status code 422' do
        post '/api/login', params: { email: 'test@gmail.com', password: 'password' }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include('error' => 'Missing user parameters')
      end
    end

    context 'when email format is invalid' do
      it 'returns status code 422' do
        post '/api/login', params: { user: { email: 'invalid_email_format', password: 'password'} }
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)).to include('error' => 'Invalid email format')
      end
    end

  end
  
  describe 'POST /api/logout' do
    let!(:user) { create(:user, email: 'test@gmail.com', password: 'password', password_confirmation: 'password') }
    
    context 'when the Authorization token is valid' do
      it 'returns status code 200' do
        post '/api/logout', headers: generateAuthToken(user.email,'password') 
        
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body)).to include('message' => 'Logged out successfully')
        expect(response.headers['Authorization']).not_to be_present
      end
    end

    context 'when the Authorization token is invalid' do
      it 'returns status code 401' do
        post '/api/logout', headers: generateAuthToken(user.email,'wrongpass') 
        expect(response).to have_http_status(:unauthorized)
        expect(response.body).to include('HTTP Basic: Access denied.')
        expect(response.headers['Authorization']).not_to be_present
      end
    end

    context 'when the Authorization token is missing' do
      it 'returns status code 401' do
        post '/api/logout'
        expect(response).to have_http_status(:unauthorized)
        expect(response.body).to include('HTTP Basic: Access denied.')
        expect(response.headers['Authorization']).not_to be_present
      end
    end

  end

  def generateAuthToken(email,password)
    { "Authorization" => ActionController::HttpAuthentication::Basic.encode_credentials(email, password) }
  end

end
