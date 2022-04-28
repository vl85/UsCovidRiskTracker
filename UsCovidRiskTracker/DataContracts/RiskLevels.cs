namespace UsCovidRiskTracker.Controllers
{
    internal sealed class RiskLevels
    {
        public int overall { get; set; }
        public int testPositivityRatio { get; set; }
        public int caseDensity { get; set; }
        public int infectionRate { get; set; }
    }
}
