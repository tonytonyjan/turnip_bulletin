import React from "react";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import "./style";

export default ({ island, resident, price, createdAt }) => (
  <div className="price-card">
    <Card>
      <div className="price-card__content">
        <CardContent>
          <div className="price-card__title-wrapper">
            <Typography variant="h5" component="span" color="textSecondary">
              {island}
            </Typography>
            <div className="price-card__resident">
              <Typography variant="h5" component="span" color="textSecondary">
                {resident}
              </Typography>
            </div>
          </div>
          <Typography variant="h2" component="div">
            {price}
          </Typography>
          <div className="price-card__time">
            <Typography variant="caption">{createdAt}</Typography>
          </div>
        </CardContent>
      </div>
    </Card>
  </div>
);
