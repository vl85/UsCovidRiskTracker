namespace UsCovidRiskTracker
{
    public class StateStats
    {
        public string StateName { get; set; }

        public int OverallRiskLevel { get; set; }

        public int CaseDensityLevel { get; set; }

        public int TestPositivityRatioLevel { get; set; }

        public int InfectionRateLevel { get; set; }
    }
}
