import * as React from "react";

interface TrophiesBadgeProps {
    trophies: number[];
}

class TrophiesBadge extends React.Component<TrophiesBadgeProps, {}> {
    public render() {
        const {trophies} = this.props;
        return (
            <div style={{display: "flex"}}>
                <div style={{display: "flex"}}>
                    <span style={{margin: "4px"}}>{trophies[0].toString()}</span>
                    <img
                        src="https://hrcdn.net/hackerrank/assets/badges/gold_small-90e95e4632dabf13609debebc49d8635.svg"/>
                </div>

                <div style={{display: "flex"}}>
                    <span style={{margin: "4px"}}>{trophies[1].toString()}</span>
                    <img
                        src="https://hrcdn.net/hackerrank/assets/badges/silver_small-a1d0ba9d3781e58d48c1e89285557401.svg"/>
                </div>

                <div style={{display: "flex"}}>
                    <span style={{margin: "4px"}}>{trophies[2].toString()}</span>
                    <img
                        src="https://hrcdn.net/hackerrank/assets/badges/bronze_small-ccb05462f608043be528d2fdaeedb62c.svg"/>
                </div>
            </div>
        );
    }
}

export default TrophiesBadge;