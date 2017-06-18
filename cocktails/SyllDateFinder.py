import datetime
import dateutil.parser as dparser



def stringSplitter(textstr):
    upcomingLine = "Today's date not found."
    for i, line in enumerate(textstr.splitlines()):
        try:

            print "Date FOUND!: {}".format(dparser.parse(line, fuzzy=True).date())
            d1 = datetime.date.today()
            d2 = dparser.parse(line, fuzzy=True)
            monday1 = (d1 - datetime.timedelta(days=d1.weekday()))
            monday2 = (d2 - datetime.timedelta(days=d2.weekday())).date()
            weeks = (monday2 - monday1).days / 7
            if weeks == 0:
                upcomingLine = line
                lineNum = i

        except:
            print "no date found"

    return upcomingLine, lineNum

