require 'net/http'
# Thread.abort_on_exception = true
DELIBERATE_ERROR = 'Causing a deliberate error'
threads = []

delays = %w( 3.0 2.0 1.0 )

delays.each { |delay|
  threads << Thread.new(delay) do |delay|
    raise DELIBERATE_ERROR if delay.to_i == 2
    puts "Fetching: http://slowapi.com/delay/#{delay}\n"
    res = Net::HTTP.start('slowapi.com', nil) do |http|
      http.get("/delay/#{delay}")
    end
    puts "Delay #{delay}: #{res.body}"
  end
}
threads.each {|t| t.join }