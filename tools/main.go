package main

import (
	"bytes"
	"encoding/json"
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"sort"
	"text/tabwriter"
)

type company struct {
	Name      string `json:"company"`
	Email     string `json:"email"`
	Website   string `json:"website"`
	Pitchdeck string `json:"pitching_deck"`
}

func main() {
	filename := flag.String("file", "", "csv file with startups to parse")
	flag.Parse()

	raw, err := os.ReadFile(*filename)
	if err != nil {
		log.Fatal(err)
	}

	companies := []company{}
	if err := json.NewDecoder(bytes.NewBuffer(raw)).Decode(&companies); err != nil {
		log.Fatal(err)
	}

	sort.Slice(companies, func(i, j int) bool {
		return companies[i].Name < companies[j].Name
	})

	w := tabwriter.NewWriter(os.Stdout, 0, 0, 1, ' ', tabwriter.DiscardEmptyColumns)

	missingPitchdecks := []company{}
	lostPitchdeck := []company{}

	for _, company := range companies {
		if company.Pitchdeck == "" {
			missingPitchdecks = append(missingPitchdecks, company)
		} else {
			resp, err := http.Get(company.Pitchdeck)
			if err != nil {
				log.Fatal(err)
			}

			if resp.StatusCode == 403 {
				lostPitchdeck = append(lostPitchdeck, company)
			}
		}
	}

	fmt.Fprintln(w, "all pitchdecks")
	for _, company := range companies {
		fmt.Fprintf(w, "%s\t%s\t%s\n", company.Name, company.Email, company.Pitchdeck)
	}

	fmt.Fprintln(w, "missing pitchdecks")
	for _, company := range missingPitchdecks {
		fmt.Fprintf(w, "%s\t%s\n", company.Name, company.Email)
	}

	fmt.Fprintln(w, "lost pitchdecks")
	for _, company := range lostPitchdeck {
		fmt.Fprintf(w, "%s\t%s\t%s\n", company.Name, company.Email, company.Pitchdeck)
	}

	w.Flush()
}
