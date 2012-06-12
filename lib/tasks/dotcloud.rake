require 'rubygems'
require 'bundler'
require 'ostruct'
require 'yaml'

# Rake tasks take an argument for the environment. Call using: rake dotcloud:deploy[production]
namespace :dotcloud do
  
  desc 'Enable production interaction'
  task :go, :env do |t, args|
    args.with_defaults(:env => 'production')
  end
  
  desc 'Deploy the site'
  task :deploy, :env do |t, args|
    args.with_defaults(:env => 'production')
    deploy(args.env)
  end
  
  desc 'Update the database'
  task :update_db, :env do |t, args|
    args.with_defaults(:env => 'production')
    update_db(args.env)
  end
  
  desc 'Setup sym links'
  task :setup_symlinks, :env do |t, args|
    args.with_defaults(:env => 'production')
    setup_symlinks(args.env)
  end
  
  desc 'Clone the remote db to local'
  task :db_clone, :env do |t, args|
    args.with_defaults(:env => 'production')
    clone_db(args.env)
  end
  
  desc 'Clone prod db to staging'
  task :db_prod_to_staging do
    clone_production_db_to_staging
  end
  
  desc 'Restore the remote db from local copy in db/db.sql'
  task :restore_db, :env do |t, args|
    args.with_defaults(:env => 'production')
    restore_db(args.env)
  end
  
  desc 'Do initial setup on dotcloud. Can only be run once'
  task :initial_setup, :env do |t, args|
    args.with_defaults(:env => 'production')
    initial_setup(args.env)
  end
  
  desc 'Setup on dotcloud. Can be run multiple times if needed.'
  task :setup, :env do |t, args|
    args.with_defaults(:env => 'production')
    setup_all(args.env) 
  end
  
  desc 'Upload settings to dotcloud'
  task :settings, :env do |t, args|
    args.with_defaults(:env => 'production')
    upload_settings(args.env)
  end
  
  desc 'Create directories on dotcloud'
  task :dirs, :env do |t, args|
    args.with_defaults(:env => 'production')
    setup_dirs(args.env)
  end
  
  def app_env(env)
    'production'
  end
  
  def app_name(env)
    get_config[env.to_s]['name']
  end
  
  def app_domain(env)
    get_config[env.to_s]['url']
  end
  
  def db_name(env)
    get_config[env.to_s]['db']['name']
  end
  
  def db_name_queue(env)
    get_config[env.to_s]['db']['queue']['name']
  end
  
  def db_password(env)
    get_config[env.to_s]['db']['password']
  end
  
  def newrelic_api(env)
    get_config[env.to_s]['newrelic']['api']
  end
  
  def newrelic_account(env)
    get_config[env.to_s]['newrelic']['account_number']
  end
  
  def newrelic_application(env)
    get_config[env.to_s]['newrelic']['application_number']
  end

  def newrelic?(env)
    get_config[env.to_s]['newrelic']
  end
  
  def deploy(env)
    puts "Started deploy"
    disable_newrelic_pinging(env) if newrelic?(env)
    do_push(env)
    setup_symlinks(env)
    update_db(env)
    enable_newrelic_pinging(env) if newrelic?(env)
    start_delayed_jobs_deamon(env)
  end
  
  def initial_setup(env)
    system "dotcloud create #{app_name(env)}"
    setup_all(env)
  end
  
  def do_push(env)
    puts "stashing code changes"
    system "git stash"
    puts "creating release branch"
    system "git branch release"
    puts "Switching to release branch"
    system "git checkout release"
    puts "Merging #{app_name(env)}-stable"
    system "git merge #{app_name(env)}-stable"
    compile_assets
    system "dotcloud push -b release #{app_name(env)}"
    puts "Switching back to #{app_name(env)}-stable branch"
    system "git checkout #{app_name(env)}-stable"
    puts "unstashing code changes"
    system "git stash pop"
    puts "deleting release branch"
    system "git branch -D release"
  end
  
  def compile_assets
    puts "Compling assets"
    system "bundle exec rake canvas:compile_assets"
    system "git add ."
    system "git commit -m 'Compiled assets for deployment'"
    puts "Commited assets. Deploying..."
  end
  
  def setup_all(env)
    puts "Started setup all"
    disable_newrelic_pinging(env) if newrelic?(env)
    do_push(env)
    setup_db(env)
    setup_dirs(env)
    upload_settings(env)
    setup_symlinks(env)
    update_db(env)
    system "dotcloud alias add #{app_name(env)}.www #{app_domain(env)}" if app_domain(env)
    remove_environment(env)
    enable_newrelic_pinging(env) if newrelic?(env)
    start_delayed_jobs_deamon(env)
  end
  
  def update_db(env)
    puts "Updating database"
    system "dotcloud run #{app_name(env)}.www 'cd ~/current;RAILS_ENV=#{app_env(env)} rake db:migrate'"
    puts "Finished updating database"
  end

  def clone_db(env)
    db_file = download_db(env)
    environment = get_environment(env)
    db = OpenStruct.new(YAML.load_file("config/database.yml"))        
    system "rake db:drop"
    system "rake db:create"
    password = "-p#{db.development['password']}" if db.development['password']
    system "mysql -u #{db.development['username']} #{password} #{db.development['database']} < #{db_file}"
  end
  
  def download_db(env)
    db_file = "db/db.sql"
    system %Q{dotcloud run #{app_name(env)}.db "mysqldump -u root #{db_name(env)} > db.sql"}
    system "dotcloud run #{app_name(env)}.db cat db.sql > #{db_file}"
    db_file
  end
  
  def clone_production_db_to_staging
    env = 'staging'
    db_file = download_db('production')
    environment = get_environment(env)
    system "dotcloud run #{app_name(env)}.www 'cd ~/current;RAILS_ENV=#{app_env(env)} rake db:drop'"
    setup_db(env)
    system "dotcloud run #{app_name(env)}.db 'rm db.sql'"
    system "dotcloud run #{app_name(env)}.db 'cat > db.sql' < #{db_file}"
    system %Q{dotcloud run #{app_name(env)}.db "mysql -u root -p#{environment.DOTCLOUD_DB_MYSQL_PASSWORD} #{db_name(env)} < db.sql"}
  end
  
  def setup_db(env)
    setup_sql = 'tmp_setup.sql'
    environment = get_environment(env)
    query = "CREATE DATABASE IF NOT EXISTS #{db_name(env)};"
    query << "CREATE DATABASE IF NOT EXISTS #{db_name_queue(env)};"
    query << "GRANT ALL PRIVILEGES ON #{db_name(env)}.* TO '#{app_name(env)}'@'%' IDENTIFIED BY '#{db_password(env)}' WITH GRANT OPTION;" # This will create the user if it doesn't already exist
    query << "GRANT ALL PRIVILEGES ON #{db_name_queue(env)}.* TO '#{app_name(env)}'@'%' IDENTIFIED BY '#{db_password(env)}' WITH GRANT OPTION;" # This will create the user if it doesn't already exist
    query << "FLUSH PRIVILEGES;"
    File.open(setup_sql, 'w') {|f| f.write(query) }
    # Upload file that can create db
    system "dotcloud run #{app_name(env)}.db 'cat > setup.sql' < #{setup_sql}"
    system %Q{dotcloud run #{app_name(env)}.db "mysql -u root -p#{environment.DOTCLOUD_DB_MYSQL_PASSWORD} -e 'source setup.sql'"}
    system "rm #{setup_sql}"
  end
  
  def restore_db(env)
    system "dotcloud run #{app_name(env)}.db 'rm db.sql'"
    system "dotcloud run #{app_name(env)}.db 'cat > db.sql' < db/db.sql"    
    system "dotcloud run #{app_name(env)}.db 'mysql -u root #{db_name(env)} < db.sql'"
  end
  
  def build_db_yml(env)
    environment = get_environment(env)
    {
      app_env(env) => {
        'adapter' => "mysql",
        'database' => db_name(env),
        'username' => app_name(env),
        'password' => db_password(env),
        'host' => environment.DOTCLOUD_DB_MYSQL_HOST,
        'port' => environment.DOTCLOUD_DB_MYSQL_PORT.to_i,
        'encoding' => "utf8",
        'timeout' => "5000",
        'queue' => {
          'adapter' => "mysql",
          'database' => db_name_queue(env),
          'username' => app_name(env),
          'password' => db_password(env),
          'host' => environment.DOTCLOUD_DB_MYSQL_HOST,
          'port' => environment.DOTCLOUD_DB_MYSQL_PORT.to_i,
          'encoding' => "utf8",
          'timeout' => "5000"
        }

      }
    }
  end
  
  def get_config
    @config ||= YAML.load_file("dotcloud_config.yml")
  end
  
  def remove_environment(env)
    File.delete("#{app_name(env)}.yml") if File.exists?("#{app_name(env)}.yml")
  end
  
  def get_environment(env)
    system "dotcloud run #{app_name(env)}.www cat environment.yml > #{app_name(env)}.yml" unless File.exists?("#{app_name(env)}.yml")
    @environment ||= OpenStruct.new(YAML.load_file("#{app_name(env)}.yml"))
  end

  def setup_symlinks(env)
    puts "Adding symlinks"
    # Make sure needed directories exist
    system "dotcloud run #{app_name(env)}.www 'mkdir -p ~/current/config'"
    
    system "dotcloud run #{app_name(env)}.www 'rm ~/current/config/database.yml'"
    system "dotcloud run #{app_name(env)}.www 'rm ~/current/config/security.yml'"
    system "dotcloud run #{app_name(env)}.www 'rm ~/current/config/domain.yml'"
    system "dotcloud run #{app_name(env)}.www 'rm ~/current/config/delayed_jobs.yml'"
    system "dotcloud run #{app_name(env)}.www 'rm ~/current/config/newrelic.yml'" if newrelic?(env)
    system "dotcloud run #{app_name(env)}.www 'ln -s ~/data/config/database.yml ~/current/config'"
    system "dotcloud run #{app_name(env)}.www 'ln -s ~/data/config/security.yml ~/current/config'"
    system "dotcloud run #{app_name(env)}.www 'ln -s ~/data/config/domain.yml ~/current/config'"
    system "dotcloud run #{app_name(env)}.www 'ln -s ~/data/config/delayed_jobs.yml ~/current/config'"
    system "dotcloud run #{app_name(env)}.www 'ln -s ~/data/config/newrelic.yml ~/current/config'" if newrelic?(env)
    puts "Finished adding symlinks"
  end
  
  def setup_dirs(env)
    puts "Setting up directories"
    system "dotcloud run #{app_name(env)}.www 'mkdir -p ~/data/config'"
    puts "Finished setting up directories"
  end
  
  def upload_settings(env)
    puts "Uploading Settings"
    database_config_file = 'tmp_db.yml'
    File.open(database_config_file, 'w') {|f| f.write(build_db_yml(env).to_yaml) }
    system "dotcloud run #{app_name(env)}.www 'cat > data/config/security.yml' < config/security.yml"
    system "dotcloud run #{app_name(env)}.www 'cat > data/config/domain.yml' < config/domain.yml"
    system "dotcloud run #{app_name(env)}.www 'cat > data/config/delayed_jobs.yml' < config/delayed_jobs.yml"
    if (env == "production" && newrelic?(env))
      system "dotcloud run #{app_name(env)}.www 'cat > data/config/newrelic.yml' < config/newrelic.yml"
    elsif (env == "staging" && newrelic?(env))
      system "dotcloud run #{app_name(env)}.www 'cat > data/config/newrelic.yml' < config/staging/newrelic.yml"
    end        
    system "dotcloud run #{app_name(env)}.www 'cat > data/config/database.yml' < #{database_config_file}"
    system "rm #{database_config_file}"
    puts "Finished uploading settings"
  end
  
  def disable_newrelic_pinging(env)
    puts "Disabling New Relic pinging"
    system "dotcloud run #{app_name(env)}.www 'curl https://rpm.newrelic.com/accounts/#{newrelic_account(env)}/applications/#{newrelic_application(env)}/ping_targets/disable -X POST -H \"X-Api-Key: #{newrelic_api(env)}\"'"
    puts "Finished disabling New Relic pinging"
  end
  
  def enable_newrelic_pinging(env)
    puts "Enabling New Relic pinging"
    system "dotcloud run #{app_name(env)}.www 'curl https://rpm.newrelic.com/accounts/#{newrelic_account(env)}/applications/#{newrelic_application(env)}/ping_targets/enable -X POST -H \"X-Api-Key: #{newrelic_api(env)}\"'"
    puts "Finished enabling New Relic pinging"
  end

  def start_delayed_jobs_deamon(env)
    puts "Starting delayed job deamon"
    system "dotcloud run #{app_name(env)}.www 'cd ~/current;bundle exec script/delayed_job start'"
    puts "Finished starting delayed job deamon"
  end
  
end