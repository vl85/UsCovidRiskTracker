using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Json;
using System.Text.Json;
using System.Threading.Tasks;

namespace UsCovidRiskTracker.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CovidStatsController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly IMemoryCache _memoryCache;
        private readonly ILogger<CovidStatsController> _logger;

        private readonly IHttpClientFactory _httpClientFactory;

        private const string StateStatsCacheKey = "StateStats";

        public CovidStatsController(IHttpClientFactory httpClientFactory, IConfiguration configuration, IMemoryCache memoryCache, ILogger<CovidStatsController> logger)
        {
            _httpClientFactory = httpClientFactory;
            _configuration = configuration;
            _memoryCache = memoryCache;
            _logger = logger;
        }

        [HttpGet]
        public async Task<IEnumerable<StateStats>> Get()
        {
            if (!_memoryCache.TryGetValue(StateStatsCacheKey, out StateStats[] cacheValue))
            {
                HttpClient client = _httpClientFactory.CreateClient();

                var apiKey = _configuration.GetValue<string>("CovidActNowApiKey");

                var data = await client.GetFromJsonAsync<StateData[]>($"https://api.covidactnow.org/v2/states.json?apiKey={apiKey}");

                var statesAbbrStr = await System.IO.File.ReadAllTextAsync(@"Data/states-abbr.json");

                var statesAbbr = JsonSerializer.Deserialize<StateAbbr[]>(statesAbbrStr);
                var statesAbbrDict = statesAbbr.ToDictionary(s => s.abbr, s => s.name);

                cacheValue = data.Select(s => new StateStats
                {
#warning //TODO Get safer here
                    StateName = statesAbbrDict[s.state],
                    OverallRiskLevel = s.riskLevels.overall,
                    CaseDensityLevel = s.riskLevels.caseDensity,
                    TestPositivityRatioLevel = s.riskLevels.testPositivityRatio,
                    InfectionRateLevel = s.riskLevels.infectionRate
                }).ToArray();


                var tomorrow = new DateTimeOffset(DateTime.Today.AddDays(1));

                var cacheEntryOptions = new MemoryCacheEntryOptions()
                    .SetAbsoluteExpiration(tomorrow);

                _memoryCache.Set(StateStatsCacheKey, cacheValue, cacheEntryOptions);
            }            

            return cacheValue;
        }
    }
}
