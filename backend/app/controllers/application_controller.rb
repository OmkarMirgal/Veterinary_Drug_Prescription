class ApplicationController < ActionController::API
    include ActionController::HttpAuthentication::Basic::ControllerMethods
    before_action :authenticate_user

    private

    def authenticate_user
        authenticate_or_request_with_http_basic do |email, password|
            user = User.find_by(email: email)
            user&.authenticate(password)
        end
    end

    def current_user
        @current_user ||= begin
          auth_header = request.headers['Authorization']
          return nil unless auth_header.present?
    
          user = decodeAuthToken(auth_header)
        end
    end

    def generateBasicAuthToken(email,password)
        ActionController::HttpAuthentication::Basic.encode_credentials(email, password)
    end

    def decodeAuthToken(basicAuthToken)
        return nil unless basicAuthToken.present?

        decoded_auth_token = Base64.decode64(basicAuthToken.split(' ').last)
        email, password = decoded_auth_token.split(':', 2)
    
        user = User.find_by(email: email)
        user && user.authenticate(password) ? user : nil
    end

end
