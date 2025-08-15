
import { Enum } from "System";
import { TextMeshProUGUI } from "TMPro";
import { Color, GameObject, MonoBehaviour } from "UnityEngine";
import { Button, Image } from "UnityEngine.UI";
import UpgradeMenu from "./UpgradeMenu";

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

    @SerializeField button: Button;
    public buttonNumber: int;

    @SerializeField private rimImage: Image;
    @SerializeField private icon: Image;
    @SerializeField private nameText: TextMeshProUGUI;
    @SerializeField private amountText: TextMeshProUGUI;
    @SerializeField private rarityText: TextMeshProUGUI;

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
        [5, 10, 20], // Carrying Strength
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
    
    //Called when script instance is loaded
    private Awake() : void 
    {
          
    }

    //Start is called on the frame when a script is enabled just 
    //before any of the Update methods are called the first time.
    private Start() : void 
    {
        console.log("START BUTTON");
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

        // Setup Icon
        for (let i = 0; i < this.iconImages.length; i++)
        {
            if (i == this.upgradeType)
                this.iconImages[i].SetActive(true);
            else
                this.iconImages[i].SetActive(false);
        }
    }

    private ChooseUpgrade()
    {
        // Improve stat and play animation before panning to the tower
        this.menu.PlaySelectedUpgradeAnimation(this.buttonNumber);
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
}
