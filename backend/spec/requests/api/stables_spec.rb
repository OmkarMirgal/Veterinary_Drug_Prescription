require 'rails_helper'

RSpec.describe "/stables", type: :request do
  let!(:user) { create(:user, password: 'password', password_confirmation: 'password') }
  let(:invalid_attributes) { attributes_for(:stable, name: nil, location: nil) }

  let(:valid_headers) do
    credentials = Base64.encode64("#{user.email}:password")
    { 'Authorization' => "Basic #{credentials}" }
  end

  let(:invalid_headers) do
    credentials = Base64.encode64("invalid:credentials")
    { 'Authorization' => "Basic #{credentials}" }
  end

  describe 'GET /api/stables' do
    let!(:stable) { create(:stable, user: user) }
    
    context 'when the request is valid' do
      it 'returns stables for the authenticated user' do
        get '/api/stables', headers: valid_headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).size).to eq(1)
      end

      it 'returns unauthorized for invalid credentials' do
        get '/api/stables', headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end

  describe 'POST /api/stables' do
    let!(:stables) { create_list(:stable, 3, user: user) }
    let(:valid_attributes) { attributes_for(:stable, name: "TestStable") }
    
    context 'when the request is valid' do
      it 'creates a stable for the current_user' do
        post '/api/stables', params: { stable: valid_attributes },  headers: valid_headers
        expect(response).to have_http_status(:created)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response["name"]).to eq("TestStable")
        expect(parsed_response["user_id"]).to eq(user.id)
      end

      it 'creates multiple stables for a user' do
        expect(user.stables.count).to eq(3)
        expect(Stable.where(user_id: user.id).count).to eq(3)
        stables.each do |stable|
          expect(stable.user).to eq(user)
        end
      end
    end
    
    context 'when the request is invalid' do
      it 'returns unauthorized for invalid header' do
        post '/api/stables', params: { stable: valid_attributes }, headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns unprocessable_entity for invalid params' do
        post '/api/stables', params: { stable: invalid_attributes }, headers: valid_headers
        expect(response).to have_http_status(:unprocessable_entity)
      end
      
      it 'returns 400 for bad request' do
        post "/api/stables", params: invalid_attributes , headers: valid_headers
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq('Request body must be wrapped with "stable": {}')
      end
    end

  end

  describe 'PUT /api/stables/:id' do
    let!(:stable) { create(:stable, name: 'Stable Name', user: user) }
    let(:valid_attributes) { { stable: { name: 'Updated Stable Name', location: 'Updated Stable Location' } } }

    context 'when the request is valid' do
      it 'updates a stable for the authenticated user' do
        put "/api/stables/#{stable.id}", params: valid_attributes, headers: valid_headers
  
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['name']).to eq('Updated Stable Name')
        expect(parsed_response['location']).to eq('Updated Stable Location')
      end
    end

    context 'when the request is invalid' do
      it 'returns unauthorized for invalid header' do
        put "/api/stables/#{stable.id}", params: valid_attributes, headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end
      
      it 'returns unprocessable_entity for invalid params' do
        put "/api/stables/#{stable.id}", params: {stable: invalid_attributes } , headers: valid_headers
        
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns 400 for bad request' do
        put "/api/stables/#{stable.id}", params: invalid_attributes , headers: valid_headers
        
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq('Request body must be wrapped with "stable": {}')
      end
    end

    let!(:other_stable) { create(:stable, name: 'Other Stable', location: 'Other Location', user: user) }
    let(:duplicate_location_attributes) { { stable: { name: 'Updated Stable Name', location: other_stable.location } } }

    context 'when the updated location is already taken' do
      it 'does not update the stable and returns errors' do
        put "/api/stables/#{stable.id}", params: duplicate_location_attributes, headers: valid_headers
  
        expect(response).to have_http_status(:unprocessable_entity)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['errors'][0]).to include('has already been taken')
      end
    end

  end

  describe 'DELETE /api/stables/:id' do
    let!(:stable_to_delete) { create(:stable, user: user) }
    
    context 'when the request is valid' do
      it 'deletes a stable for the authenticated user' do
        expect {
          delete "/api/stables/#{stable_to_delete.id}", headers: valid_headers
        }.to change(Stable, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
      
      it 'reduces the user\'s stable count by 1' do
        expect {
          delete "/api/stables/#{stable_to_delete.id}", headers: valid_headers
        }.to change { user.stables.count }.by(-1)
      end

    end

    context 'when the request is invalid' do
      it 'returns unauthorized for invalid header' do
        delete "/api/stables/#{stable_to_delete.id}", headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns 400 for bad request' do
        delete "/api/stables/#{0}", headers: valid_headers
        
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('Stable not found')
      end
    end

  end
















  # let(:valid_attributes) {
  #   skip("Add a hash of attributes valid for your model")
  # }

  # let(:invalid_attributes) {
  #   skip("Add a hash of attributes invalid for your model")
  # }

  # # This should return the minimal set of values that should be in the headers
  # # in order to pass any filters (e.g. authentication) defined in
  # # StablesController, or in your router and rack
  # # middleware. Be sure to keep this updated too.
  # let(:valid_headers) {
  #   {}
  # }

  # describe "GET /api/stables" do
  #   it "renders a successful response" do
  #     Stable.create! valid_attributes
  #     get stables_url, headers: valid_headers, as: :json
  #     expect(response).to be_successful
  #   end
  # end

  # describe "GET /show" do
  #   it "renders a successful response" do
  #     stable = Stable.create! valid_attributes
  #     get stable_url(stable), as: :json
  #     expect(response).to be_successful
  #   end
  # end

  # describe "POST /create" do
  #   context "with valid parameters" do
  #     it "creates a new Stable" do
  #       expect {
  #         post stables_url,
  #              params: { stable: valid_attributes }, headers: valid_headers, as: :json
  #       }.to change(Stable, :count).by(1)
  #     end

  #     it "renders a JSON response with the new stable" do
  #       post stables_url,
  #            params: { stable: valid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:created)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end

  #   context "with invalid parameters" do
  #     it "does not create a new Stable" do
  #       expect {
  #         post stables_url,
  #              params: { stable: invalid_attributes }, as: :json
  #       }.to change(Stable, :count).by(0)
  #     end

  #     it "renders a JSON response with errors for the new stable" do
  #       post stables_url,
  #            params: { stable: invalid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:unprocessable_entity)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end
  # end

  # describe "PATCH /update" do
  #   context "with valid parameters" do
  #     let(:new_attributes) {
  #       skip("Add a hash of attributes valid for your model")
  #     }

  #     it "updates the requested stable" do
  #       stable = Stable.create! valid_attributes
  #       patch stable_url(stable),
  #             params: { stable: new_attributes }, headers: valid_headers, as: :json
  #       stable.reload
  #       skip("Add assertions for updated state")
  #     end

  #     it "renders a JSON response with the stable" do
  #       stable = Stable.create! valid_attributes
  #       patch stable_url(stable),
  #             params: { stable: new_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:ok)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end

  #   context "with invalid parameters" do
  #     it "renders a JSON response with errors for the stable" do
  #       stable = Stable.create! valid_attributes
  #       patch stable_url(stable),
  #             params: { stable: invalid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:unprocessable_entity)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end
  # end

  # describe "DELETE /destroy" do
  #   it "destroys the requested stable" do
  #     stable = Stable.create! valid_attributes
  #     expect {
  #       delete stable_url(stable), headers: valid_headers, as: :json
  #     }.to change(Stable, :count).by(-1)
  #   end
  # end
end
