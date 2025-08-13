
import { Enum } from "System";
import { TextMeshProUGUI } from "TMPro";
import { Color, MonoBehaviour } from "UnityEngine";
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
    public amount: float;

    @SerializeField commonColor: Color;
    @SerializeField uncommonColor: Color;
    @SerializeField rareColor: Color;
    @SerializeField legendaryColor: Color;
    
    //Called when script instance is loaded
    private Awake() : void 
    {
        //SignalBus.subscribe("MyEvent", this.ChooseUpgrade);

        //this.button.onClick.AddListener(() => SignalBus.trigger("MyEvent"));
        //this.SetupUpgradeItem();    
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
    }

    private ChooseUpgrade()
    {
        // Improve stat and play animation before panning to the tower
        this.menu.PlaySelectedUpgradeAnimation(this.buttonNumber);
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
        let name = "common";

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
}
