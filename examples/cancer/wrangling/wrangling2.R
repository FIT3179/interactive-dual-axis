library(dplyr)


data.cancer <- read.csv("Lung cancer death rate USA.csv")
data.sales <- read.csv("Cigarettes per adult per day USA.csv")

data.combine <- left_join(data.sales, data.cancer, by = "Year")


write.csv(data.combine, "cigarsalesandlungcancer.csv", row.names = F, quote = F)
