
import { GeniesLeaderboardSdk } from "Genies.Leaderboard";
import { GeniesLoginSdk } from "Genies.Login.Native";
import { LeaderboardGetRanksResponse, LeaderboardGetTopNRanksResponse, LeaderboardUserRank } from "Genies.SDKServices.Model";
import { TypeEnum } from "Genies.SDKServices.Model.LeaderboardSubmitUserScoreRequest";
import { Task } from "System.Threading.Tasks";
import { MonoBehaviour } from "UnityEngine";
import RoundManager from "./RoundManager";
import { TextMeshProUGUI } from "TMPro";

export default class LeaderboardPostGame extends MonoBehaviour {

    @SerializeField private leaderboardId: string;
    private myUserId: string;

    @SerializeField private podiumNamesTexts: TextMeshProUGUI[];
    @SerializeField private podiumScoresTexts: TextMeshProUGUI[];

    @SerializeField private surroundingRanksTexts: TextMeshProUGUI[];
    @SerializeField private surroundingRankNamesTexts: TextMeshProUGUI[];
    @SerializeField private surroundingRankScoreTexts: TextMeshProUGUI[];
    
    //Called when script instance is loaded
    private Awake() : void {}

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.Initialize();
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    async Initialize()
    {
        this.myUserId = await GeniesLoginSdk.GetUserIdAsync();

        // Submit user score
        await GeniesLeaderboardSdk.SubmitCurrentUserScoreAsync(this.leaderboardId, RoundManager.round, TypeEnum.DIRECT);

        // Get top 3 scores
        let topNRanks = await this.GetTopNScores(3);

        // Get scores around user
        let ranksAroundUser = await this.GetUserScoresAroundRank();

        // Setup podium
        this.SetupPodium(topNRanks);

        // Setup ranks around user
        await this.SetupUserRankAndAround(ranksAroundUser);
    }

    private SetupPodium(topRanks: LeaderboardGetTopNRanksResponse) : void
    {
        for (let i = 0; i < 3; i++)
        {
            if (i >= topRanks.UserRanks.Count)
            {
                // No user on this rank
                this.podiumNamesTexts[i].text = "--";
                this.podiumScoresTexts[i].text = "--";
            }
            else if (this.IsValidToShowOnTheLeaderboard(topRanks.UserRanks[i]))
            {
                // User is valid. Show on the podium
                this.podiumNamesTexts[i].text = topRanks.UserRanks[i].PrefUsername;
                this.podiumScoresTexts[i].text = topRanks.UserRanks[i].HighestScore.toString();
            }
            else
            {
                // Invalid user
                this.podiumNamesTexts[i].text = "--";
                this.podiumScoresTexts[i].text = "--";
            }
        }
    }

    private IsValidToShowOnTheLeaderboard(leaderboardUserRank: LeaderboardUserRank) : bool
    {
        if (leaderboardUserRank.UserId == null)
            return false;
        if (leaderboardUserRank.Username == null)
            return false;
        if (leaderboardUserRank.FirstName == null && leaderboardUserRank.LastName == null)
            return false;
        if (leaderboardUserRank.HighestScore == null)
            return false;

        return true;
    }

    async SetupUserRankAndAround(closeRanks: LeaderboardGetRanksResponse)
    {
        // Get user
        let user = await GeniesLeaderboardSdk.GetCurrentUserRankAsync(this.leaderboardId);

        // MID RANK
        // Set user values
        this.surroundingRankNamesTexts[1].text = user.PrefUsername;
        this.surroundingRanksTexts[1].text = user.Rank.toString() + ".";
        this.surroundingRankScoreTexts[1].text = user.HighestScore.toString();

        //console.log(closeRanks.UserRanks[0].PrefUsername);
        //console.log(closeRanks.UserRanks[1].PrefUsername);
        //console.log(closeRanks.UserRanks[2].PrefUsername);

        // Check if user is in first place
        if (user.Rank == 1)
        {
            // Make text above null
            this.surroundingRankNamesTexts[0].text = "";
            this.surroundingRanksTexts[0].text = "--";
            this.surroundingRankScoreTexts[0].text = "--";
        }
        else
        {
            // TOP RANK
            // User is not in first place. Show player ranked above
            this.surroundingRankNamesTexts[0].text = closeRanks.UserRanks[0].PrefUsername;
            this.surroundingRanksTexts[0].text = closeRanks.UserRanks[0].Rank.toString() + ".";
            this.surroundingRankScoreTexts[0].text = closeRanks.UserRanks[0].HighestScore.toString();
        }

        // LOW RANK RANK
        // Show player ranked below
        if (closeRanks.UserRanks.Count > 1 && user.Rank == 1 || closeRanks.UserRanks.Count > 2)
        {
            this.surroundingRankNamesTexts[2].text = closeRanks.UserRanks[2].PrefUsername;
            this.surroundingRanksTexts[2].text = closeRanks.UserRanks[2].Rank.toString() + ".";
            this.surroundingRankScoreTexts[2].text = closeRanks.UserRanks[2].HighestScore.toString();
        }
        else
        {
            // No player ranked below
            this.surroundingRankNamesTexts[2].text = "";
            this.surroundingRanksTexts[2].text = "--";
            this.surroundingRankScoreTexts[2].text = "--";
        }
    }

    async GetTopNScores(limit: int = 3) : Promise<LeaderboardGetTopNRanksResponse>
    {
        let topRanks = await GeniesLeaderboardSdk.GetTopNRanksAsync(this.leaderboardId, limit);
        return topRanks;
    }

    async GetUserScoresAroundRank() : Promise<LeaderboardGetRanksResponse>
    {
        let ranksAroundMe = await GeniesLeaderboardSdk.GetRanksAroundUserAsync(this.leaderboardId, 3, 1);
        return ranksAroundMe;
    }
}
