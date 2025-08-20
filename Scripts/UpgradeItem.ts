
import { Enum } from "System";
import { TextMeshProUGUI } from "TMPro";
import { Color, GameObject, MonoBehaviour } from "UnityEngine";
import { Button, Image } from "UnityEngine.UI";
import UpgradeMenu from "./UpgradeMenu";
import Upgrades from "./Upgrades";
import WoodBackpack from "./WoodBackpack";
import PlayerHealth from "./PlayerHealth";

export enum UpgradeType
{
    WALK_SPEED,
    CHOP_SPEED,
    CARRY_CAPACITY,
    CARRYING_STRENGTH,
    REGROWTH_TIME,
    TURRET_DAMAGE,
    HEAL_FULL
}

export enum Rarity
{
    COMMON,
    UNCOMMON,
    RARE,
    LEGENDARY
}

export default class UpgradeItem extends MonoBehaviour {

    private menu: UpgradeMenu;

    private backpack: WoodBackpack;
    private playerHealth: PlayerHealth;

    @SerializeField button: Button;
    public buttonNumber: int;

    @SerializeField private rimImage: Image;
    //@SerializeField private icon: Image;
    @SerializeField private nameText: TextMeshProUGUI;
    @SerializeField private amountText: TextMeshProUGUI;
    @SerializeField private rarityText: TextMeshProUGUI;
    @SerializeField private fromToText: TextMeshProUGUI;

    public upgradeType: UpgradeType;
    public rarity: Rarity;
    //public amount: float;

    @SerializeField commonColor: Color;
    @SerializeField uncommonColor: Color;
    @SerializeField rareColor: Color;
    @SerializeField legendaryColor: Color;

    @SerializeField iconImages: GameObject[];

    // Upgrade values and affixes, EX: "+" "20" "%" = +20%
    private amounts: float[][] = [
        [5, 10, 20], // Walk Speed
        [10, 15, 30], // Chop Speed
        [2, 3, 6], // Wood Capacity
        [10, 15, 30], // Carrying Strength
        [-10, -15, -25], // Regrowth Time
        [50], // Turret Damage
        [100] // Full heal
    ];
    private suffixes: string[] = [
        "%", // Walk Speed
        "%", // Chop Speed
        "", // Wood Capacity
        "%", // Carrying Strength
        "s", // Regrowth Time
        "%", // Turret Damage
        "%" // Full heal
    ];
    private prefixes: string[] = [
        "+", // Walk Speed
        "+", // Chop Speed
        "+", // Wood Capacity
        "+", // Carrying Strength
        "", // Regrowth Time
        "+", // Turret Damage
        "" // Full heal
    ];

    private clickedUpgrade: bool = false;
    
    //Called when script instance is loaded
    private Awake() : void 
    {
        // Get references
        this.backpack = GameObject.FindGameObjectWithTag("Player").GetComponent<WoodBackpack>();
        this.playerHealth = GameObject.FindGameObjectWithTag("Player").GetComponent<PlayerHealth>();
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        this.menu = UpgradeMenu.Instance;

        this.button.onClick.AddListener(this.ChooseUpgrade);
    }

    //Update is called every frame, if the MonoBehaviour is enabled.
    private Update() : void {}

    // Is called from UpgradeMenu
    public SetupUpgradeItem() : void
    {
        // Setup colors
        let itemColor = this.ItemColor();

        this.rimImage.color = itemColor;
        this.rarityText.color = itemColor;
        this.nameText.color = itemColor;

        // Setup texts
        this.rarityText.text = this.RarityString();
        this.nameText.text = this.TypeString();
        this.amountText.text = this.MakeUpgradeValueString(this.upgradeType, this.rarity);
        this.fromToText.text = this.FromTo(this.upgradeType, this.rarity);

        // Setup Icon
        for (let i = 0; i < this.iconImages.length; i++)
        {
            if (i == this.upgradeType)
                this.iconImages[i].SetActive(true);
            else
                this.iconImages[i].SetActive(false);
        }

        // Make button clickable
        this.clickedUpgrade = false;
    }

    // Called when clicking the button with the chosen upgrade
    private ChooseUpgrade()
    {
        if (this.clickedUpgrade)
            return;

        this.clickedUpgrade = true;

        // Improve stat
        this.ImproveStat(this.upgradeType, this.rarity);

        // Play animation, before panning to the tower
        this.menu.PlaySelectedUpgradeAnimation(this.buttonNumber);
    }

    private ImproveStat(type: UpgradeType, rarity: int): void
    {
        switch (type)
        {
            case UpgradeType.CARRYING_STRENGTH:
                Upgrades.carryStrength += (this.amounts[type][rarity]) / 100;
                break;
            case UpgradeType.CARRY_CAPACITY:
                Upgrades.woodCapacity += (this.amounts[type][rarity]);
                this.backpack.UpdateText();
                break;
            case UpgradeType.CHOP_SPEED:
                Upgrades.chopSpeed += (this.amounts[type][rarity]) / 100;
                break;
            case UpgradeType.REGROWTH_TIME:
                Upgrades.reGrowthTime += (this.amounts[type][rarity]);
                break;
            case UpgradeType.WALK_SPEED:
                Upgrades.walkSpeed += (this.amounts[type][rarity]) / 100;
                break;
            case UpgradeType.HEAL_FULL:
                PlayerHealth.health = PlayerHealth.maxHealth;
                this.playerHealth.UpdateHealthBar();
                break;
            case UpgradeType.TURRET_DAMAGE:
                Upgrades.turretDamage += 5;
                break;
        }
    }

    private MakeUpgradeValueString(upgrade: int, rarity: int): string
    {
        if (rarity == 3) rarity = 0; // if Legendary, "amounts" only has one option
        let word = this.prefixes[upgrade] + this.amounts[upgrade][rarity].toString() + this.suffixes[upgrade];

        return word;
    }

    private ItemColor() : Color
    {
        let col = this.commonColor;

        switch(this.rarity)
        {
            case Rarity.COMMON:
                col = this.commonColor;
                break;
            case Rarity.UNCOMMON:
                col = this.uncommonColor;
                break;
            case Rarity.RARE:
                col = this.rareColor;
                break;
            case Rarity.LEGENDARY:
                col = this.legendaryColor;
                break;
        }

        return col;
    }

    private RarityString() : string
    {
        let name = "null";

        switch(this.rarity)
        {
            case Rarity.COMMON:
                name = "common";
                break;
            case Rarity.UNCOMMON:
                name = "uncommon";
                break;
            case Rarity.RARE:
                name = "rare";
                break;
            case Rarity.LEGENDARY:
                name = "legendary";
                break;
        }

        return name;
    }

    private TypeString() : string
    {
        let type = "null";

        switch(this.upgradeType)
        {
            case UpgradeType.CARRYING_STRENGTH:
                type = "carry strength";
                break;
            case UpgradeType.CARRY_CAPACITY:
                type = "wood capacity";
                break;
            case UpgradeType.CHOP_SPEED:
                type = "chop speed";
                break;
            case UpgradeType.REGROWTH_TIME:
                type = "regrowth time";
                break;
            case UpgradeType.WALK_SPEED:
                type = "walk speed";
                break;
            case UpgradeType.HEAL_FULL:
                type = "full heal";
                break;
            case UpgradeType.TURRET_DAMAGE:
                type = "turret damage";
                break;
        }

        return type;
    }

    private FromTo(type: UpgradeType, rarity: int): string
    {
        let from = "from";
        let to = "to";
        let increases = [ 0.0, 0.0, 0.0 ];

        switch(this.upgradeType)
        {
            case UpgradeType.CARRYING_STRENGTH:
                increases = [ 0.1, 0.15, 0.3 ];
                from = parseFloat(Upgrades.carryStrength.toFixed(2)).toString();
                to = parseFloat((Upgrades.carryStrength + increases[rarity]).toFixed(2)).toString();
                break;
            case UpgradeType.CARRY_CAPACITY:
                increases = [ 2, 3, 6 ];
                from = Upgrades.woodCapacity.toString();
                to = (Upgrades.woodCapacity + increases[rarity]).toString();
                break;
            case UpgradeType.CHOP_SPEED:
                increases = [ 0.1, 0.15, 0.3 ];
                from = parseFloat(Upgrades.chopSpeed.toFixed(2)).toString();
                to = parseFloat((Upgrades.chopSpeed + increases[rarity]).toFixed(2)).toString();
                break;
            case UpgradeType.REGROWTH_TIME:
                increases = [ -10, -15, -25 ];
                from = Upgrades.reGrowthTime.toString();
                to = (Upgrades.reGrowthTime + increases[rarity]).toString();
                break;
            case UpgradeType.WALK_SPEED:
                increases = [ 0.05, 0.1, 0.2 ];
                from = parseFloat(Upgrades.walkSpeed.toFixed(2)).toString();
                to = parseFloat((Upgrades.walkSpeed + increases[rarity]).toFixed(2)).toString();
                break;
            case UpgradeType.HEAL_FULL:
                from = parseFloat(PlayerHealth.health.toFixed(2)).toString();
                to = parseFloat((PlayerHealth.maxHealth).toFixed(2)).toString();
                break;
            case UpgradeType.TURRET_DAMAGE:
                from = parseFloat(Upgrades.turretDamage.toFixed(2)).toString();
                to = parseFloat((Upgrades.turretDamage + 5).toFixed(2)).toString();
                break;
        }

        // Make final string, EX: "1.2  >  1.3"
        let fromTo = from + "  >  " + to;
        return fromTo;
    }
}
