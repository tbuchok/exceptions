require 'net/http'
Thread.abort_on_exception = true
DELIBERATE_ERROR = 'Causing a deliberate error'
threads = []

delays = [
            3.0,
            2.0,
            1.0 # This will not hit.
          ]

delays.each { |delay|
  threads << Thread.new(delay) do |delay|
    res = Net::HTTP.start('slowapi.com', nil) do |http|
      raise DELIBERATE_ERROR if delay.to_i == 2
      puts "Fetching: http://slowapi.com/delay/#{delay}\n"
      http.get("/delay/#{delay}")
    end
    puts "Delay #{delay}: #{res.body}"
  end
}
threads.each {|t| t.join }