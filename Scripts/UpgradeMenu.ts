
import { Animator, AudioClip, AudioSource, Coroutine, Debug, GameObject, MonoBehaviour, Random, WaitForSeconds } from "UnityEngine";
import UpgradeItem, { Rarity, UpgradeType } from "./UpgradeItem";
import CameraMovement, { CameraState } from "./CameraMovement";
import { List$1 } from "System.Collections.Generic";
import RoundManager from "./RoundManager";

export default class UpgradeMenu extends MonoBehaviour {

    @NonSerialized public static Instance: UpgradeMenu;

    @SerializeField private upgrades: UpgradeItem[];
    @SerializeField private animator: Animator;
    @SerializeField private source: AudioSource;
    @SerializeField clips: AudioClip[];

    @SerializeField private chooseText: GameObject;

    private gameManager: CameraMovement;
    
    //Called when script instance is loaded
    private Awake() : void 
    {
        UpgradeMenu.Instance = this;
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.gameManager = CameraMovement.Instance;

        // Setup upgrade items
        //this.SetupUpgradeItems();
    }

    private OnEnable() 
    {
        // Setup upgrade items
        this.SetupUpgradeItems();

        this.chooseText.SetActive(true);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    private SetupUpgradeItems() : void
    {
        // true if one of the options is rare or legendary
        let hasRare = false;

        // Type candidates for the upgrades
        let typeArray = [ UpgradeType.CARRYING_STRENGTH, UpgradeType.CARRY_CAPACITY, 
            UpgradeType.CHOP_SPEED, UpgradeType.REGROWTH_TIME, UpgradeType.WALK_SPEED ];

        // Cycle through the upgrade options, and set up them one by one
        for (let i = 0; i < this.upgrades.length; i++)
        {
            // First determine rarity of upgrade
            let randomNumber = Random.Range(0.0, 100.0);
            let rarity = (hasRare && randomNumber > 74.9) ? Rarity.UNCOMMON : this.UpgradeRarity(randomNumber);

            if (rarity == Rarity.RARE && !hasRare || rarity == Rarity.LEGENDARY && !hasRare)
                hasRare = true;

            // Set rarity
            this.upgrades[i].rarity = rarity;

            // Determine upgrade type
            this.upgrades[i].upgradeType = this.GetUpgradeType(rarity, typeArray);

            // Remove upgrade type from the array, to prevent multiple options of the same type
            typeArray = typeArray.filter(n => n !== this.upgrades[i].upgradeType);

            // FINALLY Setup upgrade item
            this.upgrades[i].SetupUpgradeItem();
        }
    }

    // randomNumber is a value between 0 and 100
    private UpgradeRarity(randomNumber: float) : Rarity
    {
        let rarity = Rarity.COMMON;

        if (randomNumber < 50.0)
            rarity = Rarity.COMMON;
        else if (randomNumber < 75.0)
            rarity = Rarity.UNCOMMON;
        else if (randomNumber < 90.0)
            rarity = Rarity.RARE;
        else
            rarity = Rarity.LEGENDARY;

        return rarity;
    }

    private GetUpgradeType(rarity: Rarity, types: UpgradeType[]) : UpgradeType
    {
        let type = UpgradeType.WALK_SPEED;

        if (rarity == Rarity.LEGENDARY)
        {
            // Special type for legendary options
            type = (Random.Range(0.0, 100.0) > 65.0 && RoundManager.round > 5) ? 
            UpgradeType.TURRET_DAMAGE : UpgradeType.HEAL_FULL;
        }
        else
        {
            // Get random normal type
            let r = Random.Range(0, types.length);
            type = types[r];
        }

        return type;
    }

    public PlaySelectedUpgradeAnimation(option: int) : void
    {
        // Disable "choose" text
        this.chooseText.SetActive(false);

        // Play animation
        switch (option)
        {
            case 1:
                this.animator.Play("First_Option", -1, 0);
                break;
            case 2: 
                this.animator.Play("Second_Option", -1, 0);
                break;
            case 3:
                this.animator.Play("Third_Option", -1, 0);
                break;
        }

        // Play Sound
        this.source.clip = this.clips[0];
        this.source.pitch = 1;
        this.source.volume = 1;
        this.source.Play();

        // Wait for animation, then pan to tower
        this.StartCoroutine(this.AfterUpgrade());
    }

    *AfterUpgrade()
    {
        yield new WaitForSeconds(1.3);

        this.gameManager.ChangeCameraState(CameraState.PAN_TO_CLOCK_TOWER);
    }

    public DestroyInstance() : void 
    {
        console.log(`Destroying UpgradeMenu`);

        UpgradeMenu.Instance = null;
        GameObject.Destroy(this.gameObject);
    }
}
