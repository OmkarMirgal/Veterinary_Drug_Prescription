# Specify Ruby version
ARG RUBY_VERSION=3.3.3
FROM ruby:$RUBY_VERSION

# Install essential dependencies
RUN apt-get update -qq && \
    apt-get install -y --no-install-recommends \
        build-essential \
        libvips \
        bash \
        bash-completion \
        libffi-dev \
        tzdata \
        postgresql \
        nodejs \
        npm \
        yarn && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /usr/share/doc /usr/share/man

# Set working directory for the Rails application
WORKDIR /rails

# Set production environment variables
ENV RAILS_LOG_TO_STDOUT="1" \
    RAILS_SERVE_STATIC_FILES="true" \
    RAILS_ENV="production" \
    BUNDLE_WITHOUT="development"

# Install application gems
COPY Gemfile Gemfile.lock ./
RUN bundle config --global frozen 1 && \
    bundle config --global disable_shared_gems 1 && \
    bundle install --jobs "$(nproc)" --retry 3

# Copy application code
COPY . .

# Precompile bootsnap code for faster boot times (optional for API mode)
RUN bundle exec bootsnap precompile --gemfile app/ lib/

# Entrypoint prepares the database.
ENTRYPOINT ["/rails/bin/docker-entrypoint"]

# Expose the port for Rails server
EXPOSE 3000

# Default command to start the Rails server
CMD ["./bin/rails", "server"]