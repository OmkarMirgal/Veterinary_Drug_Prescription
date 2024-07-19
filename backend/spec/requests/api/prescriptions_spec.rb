require 'rails_helper'

RSpec.describe "/api/prescriptions", type: :request do
  let!(:user) { create(:user, password: 'password', password_confirmation: 'password') }
  let!(:stable) { create(:stable, user: user) }

  let(:invalid_attributes) { attributes_for(:prescription, applicationDate: nil).merge(stable_id: nil) }

  let(:valid_headers) do
    credentials = Base64.encode64("#{user.email}:password")
    { 'Authorization' => "Basic #{credentials}" }
  end

  let(:invalid_headers) do
    credentials = Base64.encode64("invalid:credentials")
    { 'Authorization' => "Basic #{credentials}" }
  end

  describe 'GET /api/prescriptions' do
    let!(:prescriptions) { create_list(:prescription, 3, user: user, stable: stable) }
    
    context 'when the request is valid' do
      it 'returns prescriptions of the authenticated user' do
        get '/api/prescriptions', headers: valid_headers
        expect(response).to have_http_status(:ok)
        expect(JSON.parse(response.body).size).to eq(3)
      end

      it 'returns unauthorized for invalid credentials' do
        get '/api/prescriptions', headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end
    end
  end
 
  describe 'POST /api/prescriptions' do
    let!(:prescriptions) { create_list(:prescription, 3, user: user, stable_id: stable.id) }
    let(:valid_attributes) { attributes_for(:prescription).merge(stable_id: stable.id) }
    
    context 'when the request is valid' do
      it 'creates a prescription for the current_user' do
        post '/api/prescriptions', params: { prescription: valid_attributes },  headers: valid_headers
        expect(response).to have_http_status(:created)
        
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['stable_id']).to eq(stable.id)
        expect(parsed_response['user_id']).to eq(user.id)
      end

      it 'creates multiple prescriptions on the Stable ' do
        expect(user.stables.count).to eq(1)
        expect(Prescription.where(user_id: user.id, stable_id: stable.id).count).to eq(3)
        prescriptions.each do |prescription|
          expect(prescription.user).to eq(user)
          expect(prescription.stable_id).to eq(stable.id)
        end
      end
      
      it 'creates multiple prescriptions by the user' do
        expect(user.prescriptions.count).to eq(3)
        expect(Prescription.where(user_id: user.id).count).to eq(3)
        prescriptions.each do |prescription|
          expect(prescription.user).to eq(user)
        end
      end
    end
    
    context 'when the request is invalid' do
      it 'returns unauthorized for invalid header' do
        post '/api/prescriptions', params: { prescription: valid_attributes }, headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns unprocessable_entity for invalid params' do
        post '/api/prescriptions', params: { prescription: invalid_attributes }, headers: valid_headers
        expect(response).to have_http_status(:unprocessable_entity)
        expect(JSON.parse(response.body)['error']).to eq("Stable not found")
      end
      
      it 'returns 400 for bad request' do
        post "/api/prescriptions", params: invalid_attributes , headers: valid_headers
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq('Request body must be wrapped with "prescription": {}')
      end
    end

  end

  describe 'PUT /api/prescriptions/:id' do
    let(:prescription) { create(:prescription, user: user, stable_id: stable.id) }
    let(:valid_attributes) { { prescription: { applicationDate: '2024-07-16', indication: 'Updated Indication' } } }

    context 'when the request is valid' do
      it 'updates a stable for the authenticated user' do
        put "/api/prescriptions/#{prescription.id}", params: valid_attributes , headers: valid_headers
        expect(response).to have_http_status(:ok)
        parsed_response = JSON.parse(response.body)
        expect(parsed_response['indication']).to eq('Updated Indication')
        expect(parsed_response['applicationDate']).to eq('2024-07-16')
      end
    end

    context 'when the request is invalid' do
      it 'returns unauthorized for invalid header' do
        put "/api/prescriptions/#{prescription.id}", params: valid_attributes, headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end
      
      it 'returns unprocessable_entity for invalid params' do
        put "/api/prescriptions/#{prescription.id}", params: {prescription: invalid_attributes } , headers: valid_headers
        
        expect(response).to have_http_status(:unprocessable_entity)
      end

      it 'returns 400 for bad request' do
        put "/api/prescriptions/#{0}", params: valid_attributes , headers: valid_headers
      
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('Prescription not found')
      end
      
      it 'returns 400 for bad request' do
        put "/api/prescriptions/#{prescription.id}", params: invalid_attributes , headers: valid_headers
        
        expect(response).to have_http_status(:bad_request)
        expect(JSON.parse(response.body)['error']).to eq('Request body must be wrapped with "prescription": {}')
      end
    end
  end

  describe 'DELETE /api/prescriptions/:id' do
    let!(:prescription_to_delete) { create(:prescription, user: user, stable: stable) }

    context 'when the request is valid' do
      it 'deletes a prescription for the authenticated user' do

        expect {
          delete "/api/prescriptions/#{prescription_to_delete.id}", headers: valid_headers
        }.to change(Prescription, :count).by(-1)
        expect(response).to have_http_status(:no_content)
      end
      
      it 'reduces the user\'s prescription count by 1' do
        expect {
          delete "/api/prescriptions/#{prescription_to_delete.id}", headers: valid_headers
        }.to change { user.prescriptions.count }.by(-1)
      end

    end

    context 'when the request is invalid' do
      it 'returns unauthorized for invalid header' do
        delete "/api/prescriptions/#{prescription_to_delete.id}", headers: invalid_headers
        expect(response).to have_http_status(:unauthorized)
      end

      it 'returns 400 for bad request' do
        delete "/api/prescriptions/#{0}", headers: valid_headers
        
        expect(response).to have_http_status(:not_found)
        expect(JSON.parse(response.body)['error']).to eq('Prescription not found')
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
  # # PrescriptionsController, or in your router and rack
  # # middleware. Be sure to keep this updated too.
  # let(:valid_headers) {
  #   {}
  # }

  # describe "GET /index" do
  #   it "renders a successful response" do
  #     Prescription.create! valid_attributes
  #     get prescriptions_url, headers: valid_headers, as: :json
  #     expect(response).to be_successful
  #   end
  # end

  # describe "GET /show" do
  #   it "renders a successful response" do
  #     prescription = Prescription.create! valid_attributes
  #     get prescription_url(prescription), as: :json
  #     expect(response).to be_successful
  #   end
  # end

  # describe "POST /create" do
  #   context "with valid parameters" do
  #     it "creates a new Prescription" do
  #       expect {
  #         post prescriptions_url,
  #              params: { prescription: valid_attributes }, headers: valid_headers, as: :json
  #       }.to change(Prescription, :count).by(1)
  #     end

  #     it "renders a JSON response with the new prescription" do
  #       post prescriptions_url,
  #            params: { prescription: valid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:created)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end

  #   context "with invalid parameters" do
  #     it "does not create a new Prescription" do
  #       expect {
  #         post prescriptions_url,
  #              params: { prescription: invalid_attributes }, as: :json
  #       }.to change(Prescription, :count).by(0)
  #     end

  #     it "renders a JSON response with errors for the new prescription" do
  #       post prescriptions_url,
  #            params: { prescription: invalid_attributes }, headers: valid_headers, as: :json
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

  #     it "updates the requested prescription" do
  #       prescription = Prescription.create! valid_attributes
  #       patch prescription_url(prescription),
  #             params: { prescription: new_attributes }, headers: valid_headers, as: :json
  #       prescription.reload
  #       skip("Add assertions for updated state")
  #     end

  #     it "renders a JSON response with the prescription" do
  #       prescription = Prescription.create! valid_attributes
  #       patch prescription_url(prescription),
  #             params: { prescription: new_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:ok)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end

  #   context "with invalid parameters" do
  #     it "renders a JSON response with errors for the prescription" do
  #       prescription = Prescription.create! valid_attributes
  #       patch prescription_url(prescription),
  #             params: { prescription: invalid_attributes }, headers: valid_headers, as: :json
  #       expect(response).to have_http_status(:unprocessable_entity)
  #       expect(response.content_type).to match(a_string_including("application/json"))
  #     end
  #   end
  # end

  # describe "DELETE /destroy" do
  #   it "destroys the requested prescription" do
  #     prescription = Prescription.create! valid_attributes
  #     expect {
  #       delete prescription_url(prescription), headers: valid_headers, as: :json
  #     }.to change(Prescription, :count).by(-1)
  #   end
  # end
end
