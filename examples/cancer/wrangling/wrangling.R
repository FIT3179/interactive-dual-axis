library(dplyr)


data.cancer <- read.csv("lung-cancer-deaths-per-100000-by-sex-1950-2002.csv")
data.sales <- read.csv("sales-of-cigarettes-per-adult-per-day.csv")


data.cancer.agg <- data.cancer %>% 
  group_by(Year) %>% 
  summarise(Cancer.death.rate.100k.male = mean(age.standardized_death_rate_per_100k_male), 
            Cancer.death.rate.100k.female = mean(age.standardized_death_rate_per_100k_female))

data.sale.agg <- data.sales %>% 
  group_by(Year) %>%
  summarise(Sales.cigarettes.per.adult.per.day = mean(Sales.of.cigarettes.per.adult.per.day..International.Smoking.Statistics..2017..))

data.combine <- left_join(data.sale.agg, data.cancer.agg, by = "Year")


write.csv(data.combine, "cancercigarettessales.csv", row.names = F, quote = F)